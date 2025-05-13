import { batchSyncWorkToTypesense } from "../../../../utils/typesense";

export default {
    async beforeUpdate(event) {
        // Store original style title before update to use in afterUpdate
        const originalStyle = await strapi.entityService.findOne('api::style.style', event.params.where.id);
        event.state.wasPublished = originalStyle.publishedAt;
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
                        styles: {
                            fields: ['title', 'publishedAt']
                        },
                    }
                });

                if (work.publishedAt === null) {
                    return null;
                }

                const styles = work.styles?.filter(c => c.publishedAt !== null);

                return {
                    id: workId.toString(),
                    styles: styles?.map(c => c.title) || [],
                };
            })) || [];

            const validFieldsToBeUpdated = fieldsToBeUpdated.filter(field => field !== null);

            if (validFieldsToBeUpdated.length === 0) {
                return;
            }

            await batchSyncWorkToTypesense(fieldsToBeUpdated);
        } catch (error) {
            strapi.log.error('Failed to sync style works to Typesense:', error);
        }
    },

    async  beforeDelete(event) {
        const itemToBeDeleted = await strapi.entityService.findOne('api::style.style', event.params.where.id, {
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
                    styles: {
                        fields: ['title', 'publishedAt']
                    },
                }
            });
            
            if (work.publishedAt === null) {
                return;
            }

            const styles = work.styles?.filter(c => c.publishedAt !== null);

            return {
                id: workId.toString(),
                styles: styles.map(c => c.title) || [],
            };
        }) || [];

        if (fieldsToBeUpdated.length === 0) {
            return;
        }

        await batchSyncWorkToTypesense(fieldsToBeUpdated);
    },

    async beforeDeleteMany(event) {
        const styleIds = event.params.where.$and[0].id.$in;

        const itemsToBeDeleted = await strapi.entityService.findMany('api::style.style', {
            filters: {
                id: {
                    $in: styleIds
                }
            },
            populate: {
                works: {
                    fields: ['id']
                }
            }
        });

        const workIdsToBeUpdated = [];
        itemsToBeDeleted?.map(item => item.works?.map(work => {
            workIdsToBeUpdated.push(work.id);
        }));

        event.state.workIdsToBeUpdated = workIdsToBeUpdated;
    },

    async afterDeleteMany(event) {
        const { state } = event;

        const workIdsToBeUpdated = state.workIdsToBeUpdated;

        const fieldsToBeUpdated = workIdsToBeUpdated.map(async workId => {
            const work = await strapi.entityService.findOne('api::work.work', workId, {
                populate: {
                    styles: {
                        fields: ['title', 'publishedAt']
                    },
                }
            });
            
            if (work.publishedAt === null) {
                return;
            }

            const styles = work.styles?.filter(c => c.publishedAt !== null);

            return {
                id: workId.toString(),
                styles: styles.map(c => c.title) || [],
            };
        }) || [];

        if (fieldsToBeUpdated.length === 0) {
            return;
        }

        await batchSyncWorkToTypesense(fieldsToBeUpdated);
    }
}
