import { batchSyncWorkToTypesense } from "../../../../utils/typesense";

export default {
    async beforeUpdate(event) {
        // Store original level title before update to use in afterUpdate
        const originaLevel = await strapi.entityService.findOne('api::level.level', event.params.where.id);
        event.state.wasPublished = originaLevel.publishedAt;
    },

    async afterUpdate(event) {
        const { result, state, params } = event;

        const ispublishStatusChanged = state.wasPublished !== result.publishedAt;

        try {
            if (!result.publishedAt && !ispublishStatusChanged) return;

            const workIdsToBeUpdated = [];
            result.works?.map(item => {
                workIdsToBeUpdated.push(item.id);
            });
            params.data?.works?.disconnect?.map(item => {
                workIdsToBeUpdated.push(item.id);
            });

            const fieldsToBeUpdated = await Promise.all(workIdsToBeUpdated.map(async workId => {
                const work = await strapi.entityService.findOne('api::work.work', workId, {
                    populate: {
                        level: {
                            fields: ['title','publishedAt']
                        },
                    }
                });

                if (work.publishedAt === null) {
                    return null;
                }

                return {
                    id: workId.toString(),
                    level: work.level?.publishedAt ? work.level?.title : null,
                };
            })) || [];

            const validFieldsToBeUpdated = fieldsToBeUpdated.filter(field => field !== null);

            if (validFieldsToBeUpdated.length === 0) {
                return;
            }

            await batchSyncWorkToTypesense(fieldsToBeUpdated);
        } catch (error) {
            strapi.log.error('Failed to sync level works to Typesense:', error);
        }
    },

    async  beforeDelete(event) {
        const itemToBeDeleted = await strapi.entityService.findOne('api::level.level', event.params.where.id, {
            populate: {
                works: {
                    fields: ['id']
                }
            }
        });

        const workIdsToBeUpdated = itemToBeDeleted.works?.map(item => item.id);
        event.state.workIdsToBeUpdated = workIdsToBeUpdated;
    },

    async afterDelete(event) {
        const { state } = event;

        const workIdsToBeUpdated = state.workIdsToBeUpdated;
        const fieldsToBeUpdated = workIdsToBeUpdated.map(async workId => {
            const work = await strapi.entityService.findOne('api::work.work', workId, {
                populate: {
                    level: {
                        fields: ['title', 'publishedAt']
                    },
                }
            });
            
            if (work.publishedAt === null) {
                return;
            }

            return {
                id: workId.toString(),
                level: work.level?.publishedAt ? work.level?.title : null,
            };
        }) || [];

        if (fieldsToBeUpdated.length === 0) {
            return;
        }

        await batchSyncWorkToTypesense(fieldsToBeUpdated);
    },

    async beforeDeleteMany(event) {
        const levelIds = event.params.where.$and[0].id.$in;

        const itemsToBeDeleted = await strapi.entityService.findMany('api::level.level', {
            filters: {
                id: {
                    $in: levelIds
                }
            },
            populate: {
                works: {
                    fields: ['id']
                }
            }
        });

        strapi.log.info(`level: ${JSON.stringify(itemsToBeDeleted, null, 2)}`);

        const workIdsToBeUpdated = [];
        itemsToBeDeleted?.map(item => item.works?.map(work => {
            workIdsToBeUpdated.push(work.id);
        }));

        event.state.workIdsToBeUpdated = workIdsToBeUpdated;
    },

    async afterDeleteMany(event) {
        const { state } = event;

        const workIdsToBeUpdated = state.workIdsToBeUpdated;

        strapi.log.info(`workIds: ${JSON.stringify(workIdsToBeUpdated, null, 2)}`);

        const fieldsToBeUpdated = workIdsToBeUpdated.map(async workId => {
            const work = await strapi.entityService.findOne('api::work.work', workId, {
                populate: {
                    level: {
                        fields: ['title', 'publishedAt']
                    },
                }
            });
            
            if (work.publishedAt === null) {
                return;
            }

            return {
                id: workId.toString(),
                level: work.level?.publishedAt ? work.level?.title : null,
            };
        }) || [];

        if (fieldsToBeUpdated.length === 0) {
            return;
        }

        await batchSyncWorkToTypesense(fieldsToBeUpdated);
    }
}
