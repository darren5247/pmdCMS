import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default {
  // Create checkout session
  async createCheckoutSession(ctx) {
    const { priceId } = ctx.request.body;
    const user = ctx.state.user; // Get authenticated user

    try {
      // Get or create Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = user.stripeCustomerId;
      } else {
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id
          }
        });

        // Save Stripe customer ID to user
        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { stripeCustomerId: newCustomer.id }
        });

        customer = newCustomer.id;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: customer,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/canceled`,
        metadata: {
          userId: user.id
        },
        allow_promotion_codes: true,
      });

      ctx.send({ sessionURL: session.url });
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  // Webhook handler
  async webhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const unparsed = Symbol.for('unparsedBody');
    const rawBody = ctx.request.body[unparsed];

    const stripeService = strapi.service('api::stripe.stripe');

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          // Send subscription start email
          await stripeService.processSubscriptionEmail(event.data.object, 'subscriptionStart');
          break;

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);

          // Handle subscription cancellation
          if (event.data.object.cancel_at_period_end) {
            await stripeService.processSubscriptionEmail(event.data.object, 'subscriptionCancel');
          } else if (event.data.previous_attributes?.cancel_at_period_end === true) {
            await stripeService.processSubscriptionEmail(event.data.object, 'subscriptionRenewed');
          }
          break;

        case 'customer.subscription.deleted':
          // Send subscription end email
          await stripeService.processSubscriptionEmail(event.data.object, 'subscriptionEnd');
          
          // Update user subscription status
          await handleSubscriptionDeleted(event.data.object);
          
          break;

        case 'invoice.paid':
          const invoice = event.data.object;

          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

            // Regular renewal
            if (invoice.billing_reason === 'subscription_cycle') {
              if (subscription.status === 'active') {
                await handleSubscriptionUpdated(subscription);
                await stripeService.processSubscriptionEmail(subscription, 'subscriptionRenew');
              }
            }
            
            // Subscription plan change
            if (invoice.billing_reason === 'subscription_update') {
              await handleSubscriptionUpdated(subscription);
              await stripeService.processSubscriptionEmail(subscription, 'subscriptionUpdate');
            }
          }
          break;

        case 'invoice.payment_failed':
          const failedInvoice = event.data.object;
          
          if (failedInvoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(failedInvoice.subscription as string);
            await stripeService.processSubscriptionEmail(subscription, 'subscriptionRenewalFailed');
          }
          break;

        case 'payment_method.updated':
          const paymentMethod = event.data.object;
          const subscriptions = await stripe.subscriptions.list({
            customer: paymentMethod.customer as string,
            status: 'active'
          });

          if (subscriptions.data.length > 0) {
            await stripeService.processSubscriptionEmail({
              ...paymentMethod,
              plan: subscriptions.data[0].items.data[0].price
            }, 'paymentMethodUpdate');
          }
          break;

        case 'customer.updated':
          const customer = event.data.object;
          const previousCustomer = event.data.previous_attributes;

          // Check if default payment method changed
          if (previousCustomer.invoice_settings?.default_payment_method ||
            previousCustomer.default_source) {

            const paymentMethod = await stripe.paymentMethods.retrieve(
              customer.invoice_settings?.default_payment_method as string ||
              customer.default_source as string
            );

            const subscriptions = await stripe.subscriptions.list({
              customer: customer.id,
              status: 'active',
              limit: 1
            });

            if (subscriptions.data.length > 0) {
              await stripeService.processSubscriptionEmail({
                ...paymentMethod,
                plan: subscriptions.data[0].items.data[0].price
              }, 'paymentMethodUpdate');
            }
          }
          break;

        case 'payment_method.attached':
          const paymentMethodAttached = event.data.object;
          // Get active subscriptions for this customer
          const subscriptionsAttached = await stripe.subscriptions.list({
            customer: paymentMethodAttached.customer as string,
            status: 'active',
            limit: 1
          });

          if (subscriptionsAttached.data.length > 0) {
            await stripeService.processSubscriptionEmail({
              ...paymentMethodAttached,
              plan: subscriptionsAttached.data[0].items.data[0].price
            }, 'paymentMethodUpdate');
          }
          break;
      }

      ctx.send({ received: true });
    } catch (err) {
      ctx.throw(400, `Webhook Error: ${err.message}`);
    }
  },

  // Get subscription status
  async getSubscriptionStatus(ctx) {
    const user = ctx.state.user;

    try {
      if (!user.stripeCustomerId) {
        return ctx.send({ status: 'no_subscription' });
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        return ctx.send({ status: 'no_subscription' });
      }

      return ctx.send({
        status: 'active',
        subscription: subscriptions.data[0],
      });
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async cancelSubscription(ctx) {
    const user = ctx.state.user;

    try {
      if (!user.subscriptionId) {
        return ctx.throw(400, 'No active subscription found');
      }

      const subscription = await stripe.subscriptions.update(user.subscriptionId, {
        cancel_at_period_end: true
      });

      return ctx.send({
        success: true,
        subscription
      });
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async createPortalSession(ctx) {
    const user = ctx.state.user;

    try {
      if (!user.stripeCustomerId) {
        return ctx.throw(400, 'No Stripe customer found');
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.FRONTEND_URL}/pricing`,
      });

      return ctx.send({
        url: session.url
      });
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async changeSubscription(ctx) {
    const user = ctx.state.user;
    const { newPriceId } = ctx.request.body;

    try {
      if (!user.subscriptionId) {
        return ctx.throw(400, 'No active subscription found');
      }

      const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);

      const updatedSubscription = await stripe.subscriptions.update(user.subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'always_invoice',
        payment_behavior: 'default_incomplete',
      });

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.FRONTEND_URL}/pricing`,
      });

      return ctx.send({
        type: 'portal',
        url: portalSession.url,
        subscription: updatedSubscription
      });
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async getPaymentMethod(ctx) {
    const user = ctx.state.user;

    try {
      if (!user.stripeCustomerId) {
        return ctx.throw(400, 'No Stripe customer found');
      }

      // First try to get from subscription
      if (user.subscriptionId) {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;

        if (customer.invoice_settings?.default_payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(
            customer.invoice_settings.default_payment_method as string
          );
          return ctx.send(paymentMethod);
        }

        if (customer.default_source) {
          const paymentMethod = await stripe.paymentMethods.retrieve(
            customer.default_source as string
          );
          return ctx.send(paymentMethod);
        }

        if (user.subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
          return ctx.send(subscription.default_payment_method);
        }
      }

      return ctx.throw(400, 'No payment method found');
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
};

async function handleSubscriptionCreated(subscription) {
  const { customer, status, items } = subscription;

  try {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { stripeCustomerId: customer }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get the latest invoice for this subscription
    const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);

    // Only update if the invoice is paid
    if (latestInvoice.status === 'paid') {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          subscriptionStatus: 'active',
          subscriptionPlan: items.data[0].price.id,
          subscriptionId: subscription.id
        }
      });
    }

  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  const { customer, status, items } = subscription;

  try {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { stripeCustomerId: customer }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        subscriptionStatus: status,
        subscriptionPlan: items.data[0].price.id,
        subscriptionId: subscription.id,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { customer } = subscription;

  try {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { stripeCustomerId: customer }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        stripeCustomerId: null,
        subscriptionStatus: 'canceled',
        subscriptionPlan: null,
        subscriptionId: null,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}