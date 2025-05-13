export default {
  routes: [
    {
      method: 'POST',
      path: '/stripe/create-checkout-session',
      handler: 'stripe.createCheckoutSession',
      config: {
        policies: ['is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/stripe/webhook',
      handler: 'stripe.webhook',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/stripe/subscription-status',
      handler: 'stripe.getSubscriptionStatus',
      config: {
        policies: ['is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/stripe/cancel-subscription',
      handler: 'stripe.cancelSubscription',
      config: {
        policies: ['is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/stripe/update-payment-method',
      handler: 'stripe.createPortalSession',
      config: {
        policies: ['is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/stripe/change-subscription',
      handler: 'stripe.changeSubscription',
      config: {
        policies: ['is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/stripe/payment-method',
      handler: 'stripe.getPaymentMethod',
      config: {
        policies: ['is-authenticated'],
      },
    },
  ],
};
