const { getService } = require('@strapi/plugin-users-permissions/server/utils/index.js');
const _ = require('lodash');
import { batchSyncWorkToTypesense } from "../../../../utils/typesense";

export default {
    async afterCreate(event) {    // Connected to "Save" button in admin panel
        const { data, where, select, populate, state } = event.params;
        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
        const emailSettings = await pluginStore.get({ key: 'email' });
        const newWorkEmailSettings = _.get(emailSettings, 'new_publisher_email_notif.options', {});
        const formattedDateBody = data.createdAt.toLocaleString();
        const formattedDateSubject = data.createdAt.toLocaleDateString();
        console.log(data);
        console.log(event);
        if (event.result.createdBy === undefined) { //added by api
            try {
                const emailBody = await getService('users-permissions').template(
                    newWorkEmailSettings.message,
                    {
                        PUBLISHER_NAME: `<a href='${strapi.config.server.url}/admin/content-manager/collectionType/api::publisher.publisher/${event.result.id}'>${data.name}</a>`,
                        TIMESTAMP: formattedDateBody,
                        CREATEDBY: `<a href='mailto:${data.users.email}'>${data.users.username}</a>`,
                        ADMIN_URL: 'https://api.pianomusicdatabase.com',
                        SERVER_URL: 'https://pianomusicdatabase.com',
                        STRAPI_ID: event.result.id


                    }
                )
                const emailSubject = await getService('users-permissions').template(
                    newWorkEmailSettings.object,
                    {
                        PUBLISHER_NAME: data.name,
                        CREATEDBY: `${data.users.email}`,
                        TIMESTAMP: formattedDateSubject,
                    }
                )
                const newWorkEmailToSend = {
                    to: newWorkEmailSettings.response_email,
                    from: newWorkEmailSettings.from.email,
                    replyTo: newWorkEmailSettings.response_email,
                    subject: emailSubject,
                    text: emailBody,
                    html: emailBody
                }
                await strapi.plugin('email').service('email').send(newWorkEmailToSend);

            } catch (err) {
                console.log(err);
            }
        } else { // manually added in strapi
            try {
                const emailBody = await getService('users-permissions').template(
                    newWorkEmailSettings.message,
                    {
                        PUBLISHER_NAME: `<a href='${strapi.config.server.url}/admin/content-manager/collectionType/api::publisher.publisher/${event.result.id}'>${event.result.name}</a>`,
                        TIMESTAMP: formattedDateBody,
                        CREATEDBY: `<a href='mailto:${event.result.createdBy.email}'>${event.result.createdBy.firstname} ${event.result.createdBy.lastname}</a>`,
                        ADMIN_URL: 'https://api.pianomusicdatabase.com',
                        SERVER_URL: 'https://pianomusicdatabase.com',
                        STRAPI_ID: event.result.id
                    }
                )
                const emailSubject = await getService('users-permissions').template(
                    newWorkEmailSettings.object,
                    {
                        PUBLISHER_NAME: event.result.name,
                        CREATEDBY: `${event.result.createdBy.firstname} ${event.result.createdBy.lastname}`,
                        TIMESTAMP: formattedDateSubject,
                    }
                )
                const newWorkEmailToSend = {
                    to: newWorkEmailSettings.response_email,
                    from: `${newWorkEmailSettings.from.name} <${newWorkEmailSettings.from.email}>`,
                    replyTo: newWorkEmailSettings.response_email,
                    subject: emailSubject,
                    text: emailBody,
                    html: emailBody
                }
                await strapi.plugin('email').service('email').send(newWorkEmailToSend);
            } catch (err) {
                console.log(err);
            }
        }
    },

    async beforeUpdate(event) {
        // Store original publisher name before update to use in afterUpdate
        const originalPublisher = await strapi.entityService.findOne('api::publisher.publisher', event.params.where.id);
        event.state.wasPublished = originalPublisher.publishedAt;
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
                        publishers: {
                            fields: ['name', 'publishedAt']
                        },
                    }
                });

                if (work.publishedAt === null) {
                    return null;
                }

                const publishers = work.publishers?.filter(c => c.publishedAt !== null);

                return {
                    id: workId.toString(),
                    name: publishers[0]?.name.toString() || null,
                    publisher: publishers.map(c => c.name) || [],
                };
            })) || [];

            const validFieldsToBeUpdated = fieldsToBeUpdated.filter(field => field !== null);

            if (validFieldsToBeUpdated.length === 0) {
                return;
            }

            await batchSyncWorkToTypesense(fieldsToBeUpdated);
        } catch (error) {
            strapi.log.error('Failed to sync publisher works to Typesense:', error);
        }
    },

    async  beforeDelete(event) {
        const itemToBeDeleted = await strapi.entityService.findOne('api::publisher.publisher', event.params.where.id, {
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
                    publishers: {
                        fields: ['name', 'publishedAt']
                    },
                }
            });
            
            if (work.publishedAt === null) {
                return;
            }

            const publishers = work.publishers?.filter(c => c.publishedAt !== null);

            return {
                id: workId.toString(),
                name: publishers[0]?.name.toString() || null,
                publisher: publishers.map(c => c.name) || [],
            };
        }) || [];

        if (fieldsToBeUpdated.length === 0) {
            return;
        }

        await batchSyncWorkToTypesense(fieldsToBeUpdated);
    },

    async beforeDeleteMany(event) {
        const publisherIds = event.params.where.$and[0].id.$in;

        const itemsToBeDeleted = await strapi.entityService.findMany('api::publisher.publisher', {
            filters: {
                id: {
                    $in: publisherIds
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
                    publishers: {
                        fields: ['name', 'publishedAt']
                    },
                }
            });
            
            if (work.publishedAt === null) {
                return;
            }

            const publishers = work.publishers?.filter(c => c.publishedAt !== null);

            return {
                id: workId.toString(),
                name: publishers[0]?.name.toString() || null,
                publisher: publishers.map(c => c.name) || [],
            };
        }) || [];

        if (fieldsToBeUpdated.length === 0) {
            return;
        }

        await batchSyncWorkToTypesense(fieldsToBeUpdated);
    }
}
