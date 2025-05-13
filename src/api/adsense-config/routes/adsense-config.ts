/**
 * adsense-config router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/adsense-config',
      handler: 'adsense-config.find',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
}; 