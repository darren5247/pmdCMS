/**
 * instrumentation service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::instrumentation.instrumentation');
