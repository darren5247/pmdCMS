/**
 * A set of functions called "actions" for `new-des-response`
 */

export default {
  processDesReponse: async (ctx, next) => {
    try {
      //console.log(ctx.request.body); how to access post body  
  //    let obj = JSON.parse(ctx.request.body);
 //     ctx.body = obj.Title;
//      strapi.log(obj);	
      let response = await strapi.service('api::work.work').processDesResponse(ctx.request.body);
      return response;
      /*(if (ctx.request.body == "hello") 
	      ctx.body = "world"
      else 
	      ctx.body = ctx.request.body;*/
    } catch (err) {
      ctx.body = err;
    }
  }
};
