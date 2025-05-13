export default {
  routes: [
     {
      method: 'POST',
      path: '/update-work/:id',
      handler: 'update-work.processWorkUpdate',
     },
  ],
};
