export default {
  routes: [
     {
      method: 'POST',
      path: '/new-des-response',
      handler: 'new-des-response.processDesReponse',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};

