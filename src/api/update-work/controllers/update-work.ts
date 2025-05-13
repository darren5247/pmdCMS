/**
 * A set of functions called "actions" for `update-work`
 */

export default {
  processWorkUpdate: async (ctx, next) => {
      try {
        let response = await strapi.service('api::work.work').processWorkUpdate(ctx.request.body, ctx.params.id);
        return response;
      } catch (err) {
        ctx.body = err;
      }
    }
};
