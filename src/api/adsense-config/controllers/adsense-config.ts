/**
 * adsense-config controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::adsense-config.adsense-config', ({strapi}) => ({
  async find(ctx) {
    const entity = await strapi.service('api::adsense-config.adsense-config').find({
      populate: {
        adUnits: true
      }
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
})); 