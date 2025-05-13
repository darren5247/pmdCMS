import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

interface SubscriptionEmailData {
    planName?: string;
    amount?: string;
    currency?: string;
    startDate?: string;
    nextBillingDate?: string;
    renewalDate?: string;
    endDate?: string;
    brand?: string;
    last4?: string;
    expiryDate?: string;
    nextAttemptDate?: string;
    failureReason?: string;
}

export default () => ({
    async sendRenewalReminders() {
        try {
            strapi.log.info("starting renewal reminders");
            const twoWeeksFromNow = Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60);

            const subscriptions = await stripe.subscriptions.list({
                status: 'active',
                current_period_end: {
                  gte: twoWeeksFromNow - 24 * 60 * 60,
                  lte: twoWeeksFromNow + 24 * 60 * 60
                }
            });

            // Filter for yearly subscriptions
            const yearlySubscriptions = subscriptions.data.filter(sub =>
                sub.items.data[0].price.recurring?.interval === 'year'
            );

            for (const subscription of yearlySubscriptions) {
                const reminderSent = await this.checkReminderSent(subscription.id);

                if (!reminderSent && !subscription.cancel_at_period_end) {
                    await this.processSubscriptionEmail(subscription, 'subscriptionRenewalReminder');
                    await this.markReminderSent(subscription.id);
                }
            }
        } catch (error) {
            strapi.log.error('Failed to send renewal reminders:', error);
        }
    },

    async checkReminderSent(subscriptionId: string): Promise<boolean> {
        const reminder = await strapi.db.query('api::subscription-reminder.subscription-reminder').findOne({
            where: {
                subscriptionId,
                sentAt: {
                    $gte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                }
            }
        });
        return !!reminder;
    },

    async markReminderSent(subscriptionId: string): Promise<void> {
        await strapi.db.query('api::subscription-reminder.subscription-reminder').create({
            data: {
                subscriptionId,
                sentAt: new Date()
            }
        });
    },

    async processSubscriptionEmail(data, templateName) {
        try {
            const user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { stripeCustomerId: data.customer }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Base template data
            let emailData: SubscriptionEmailData = {
                planName: data.plan?.nickname || 'Premium Plan',
                amount: ((data.plan?.amount || 0) / 100).toFixed(2),
                currency: (data.plan?.currency || 'usd').toUpperCase()
            };

            // Add template-specific data
            switch (templateName) {
                case 'subscriptionStart':
                    emailData = {
                        ...emailData,
                        startDate: new Date(data.start_date * 1000).toLocaleDateString(),
                        nextBillingDate: new Date(data.current_period_end * 1000).toLocaleDateString()
                    };
                    break;

                case 'subscriptionRenew':
                    emailData = {
                        ...emailData,
                        renewalDate: new Date(data.current_period_start * 1000).toLocaleDateString(),
                        nextBillingDate: new Date(data.current_period_end * 1000).toLocaleDateString()
                    };
                    break;

                case 'subscriptionUpdate':
                    emailData = {
                        ...emailData,
                        nextBillingDate: new Date(data.current_period_end * 1000).toLocaleDateString()
                    };
                    break;

                case 'subscriptionRenewalReminder':
                    emailData = {
                        ...emailData,
                        renewalDate: new Date(data.current_period_end * 1000).toLocaleDateString()
                    };
                    break;

                case 'subscriptionCancel':
                case 'subscriptionEnd':
                    emailData = {
                        ...emailData,
                        endDate: new Date(data.current_period_end * 1000).toLocaleDateString()
                    };
                    break;

                case 'paymentMethodUpdate':
                    const card = data.card || data.payment_method_details?.card;
                    emailData = {
                        brand: card?.brand?.toUpperCase() || 'Card',
                        last4: card?.last4 || '****',
                        expiryDate: card ? `${card.exp_month}/${card.exp_year}` : 'Unknown'
                    };
                    break;

                case 'subscriptionRenewalFailed':
                    const latestInvoice = await stripe.invoices.retrieve(data.latest_invoice as string);
                    const nextPaymentAttempt = latestInvoice ? 
                        new Date(latestInvoice.next_payment_attempt * 1000) : 
                        null;
                    
                    let failureReason = 'Payment failed';
                    if (latestInvoice.payment_intent) {
                        const paymentIntent = await stripe.paymentIntents.retrieve(latestInvoice.payment_intent as string);
                        if (paymentIntent.last_payment_error) {
                            // Provide user-friendly error messages based on the error code
                            switch (paymentIntent.last_payment_error.code) {
                                case 'card_declined':
                                    failureReason = 'Your card was declined. Please check your card details.';
                                    break;
                                case 'expired_card':
                                    failureReason = 'Your card has expired. Please update your payment method.';
                                    break;
                                case 'insufficient_funds':
                                    failureReason = 'Insufficient funds in your account. Please try another payment method.';
                                    break;
                                case 'processing_error':
                                    failureReason = 'There was an error processing your payment. Please try again.';
                                    break;
                                default:
                                    failureReason = paymentIntent.last_payment_error.message || 'Payment failed. Please check your payment details.';
                            }
                        }
                    }
                    
                    emailData = {
                        ...emailData,
                        nextAttemptDate: nextPaymentAttempt ? nextPaymentAttempt.toLocaleDateString() : undefined,
                        failureReason
                    };
                    break;

                case 'subscriptionRenewed':
                    emailData = {
                        ...emailData,
                        nextBillingDate: new Date(data.current_period_end * 1000).toLocaleDateString()
                    };
                    break;
            }

            strapi.log.info(`Sending ${templateName} email`);

            await strapi.service('api::email.email').sendSubscriptionEmail(
                user.id,
                templateName,
                emailData
            );
        } catch (error) {
            strapi.log.error(`Failed to send ${templateName} email:`, error);
        }
    }
});