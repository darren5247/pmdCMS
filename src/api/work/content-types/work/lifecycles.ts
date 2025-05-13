const _ = require('lodash');
import { syncWorkToTypesense, deleteWorkFromTypesense } from '../../../../utils/typesense';

function populatePayload(objects) {
    let payload = [];
    if (objects === undefined) return payload;

    objects.forEach(object => {
        console.log(object);
        if (object.name !== undefined) {
            console.log(`${object} name property is undefined`);
            payload.push(object.name.toString());
        } else {
            console.log(`${object} name property is defined`);
            payload.push(object.title.toString());
        }
    });
    return payload;
}

async function getComposerNameById(composerId: number): Promise<any> {
    try {
        const composerName = await strapi.db.query('api::composer.composer').findOne({
            select: ['name'],
            where: { id: composerId },
            populate: { category: true },
        });
        if (composerName) {
            console.log(composerName);
            return composerName;
        }
    } catch (err) {
        console.error('Error fetching work:', err);
        return null;
    }
    return null;
}

async function checkIfSendUserEmail(userId: number): Promise<any> {
    //use userid to lookup works_watch_notifications	
    //if {bool}, return {bool} 
}

async function getWorkById(workId: number): Promise<any> {
    try {
        const work = await strapi.entityService.findOne('api::work.work', workId,
            {
                populate: {
                    elements: true, composer: true, level: true,
                    publishers: true, moods: true, keySignatures: true,
                    timeSignatures: true, studentAges: true, studentTypes: true,
                    collections: true, styles: true, themes: true
                }
            });
        if (work) {
            console.log(JSON.stringify(work));
            return work;
        }
        // Handle other response status codes if necessary
    } catch (error) {
        // Handle any errors, e.g., network issues or invalid ID
        console.error('Error fetching work:', error);
    }
    return null; // Return null if the work is not found or an error occurs
}

export default {
    async beforeUpdate(event) {
        // Store original publishedAt state before update to use in afterUpdate
        const originalWork = await strapi.entityService.findOne('api::work.work', event.params.where.id);
        event.state.wasPublished = !!originalWork.publishedAt;
    },

    async afterUpdate(event) {
        const { result, state } = event;

        // Email notification
        const isNowPublished = !!result.publishedAt;
        if (state.wasPublished !== isNowPublished) { // Use state.wasPublished to check if the publication state changed from beforeUpdate
            try {
                const work = await strapi.entityService.findOne('api::work.work', result.id, {
                    populate: {
                        users: {
                            fields: ['id', 'email']
                        },
                        composers: {
                            fields: ['name']
                        }
                    }
                });

                const workUsers = work?.users || [];
                if (workUsers.length) {
                    const templateData = {
                        workTitle: work.title,
                        publishStatus: isNowPublished ? 'published' : 'unpublished',
                        composers: work.composers?.map(composer => composer.name).join(', ') || '',
                        workId: work.id
                    };
    
                    const emailService = strapi.service('api::email.email');
    
                    // Send notification to all work users
                    await Promise.all(workUsers.map(async (user) => {
                        if (user?.id) {
                            await emailService.sendNotificationEmail(
                                user.id,
                                'workNotifications',
                                'workPublishStatusChanged',
                                'workPublishStatusChanged',
                                templateData
                            );
                        }
                    }));
                } else {
                    strapi.log.info('No users to notify about work status change');
                }
            } catch (error) {
                strapi.log.error('Failed to send work publish status notification email:', error);
            }
        }

        // Typesense sync
        if (isNowPublished) {
            const work = await strapi.entityService.findOne('api::work.work', result.id, {
                populate: {
                    composers: {
                        fields: ['name','publishedAt']
                    },
                    elements: {
                        fields: ['name','publishedAt']
                    },
                    collections: {
                        fields: ['title','publishedAt']
                    },
                    styles: {
                        fields: ['title','publishedAt']
                    },
                    publishers: {
                        fields: ['name','publishedAt']
                    },
                    moods: {
                        fields: ['title','publishedAt']
                    },
                    themes: {
                        fields: ['title','publishedAt']
                    },
                    studentAges: {
                        fields: ['title','publishedAt']
                    },
                    studentTypes: {
                        fields: ['title','publishedAt']
                    },
                    keySignatures: {
                        fields: ['title','publishedAt']
                    },
                    timeSignatures: {
                        fields: ['title','publishedAt']
                    },
                    level: {
                        fields: ['title','publishedAt']
                    }
                }
            });

            await syncWorkToTypesense(work);
        } else {
            await deleteWorkFromTypesense(result.id)
        }
    },

    async afterDelete(event) {
        const { result } = event;

        strapi.log.info(`Deleting single work with id: ${result.id}`);
        try {
            await deleteWorkFromTypesense(result.id);
        } catch (error) {
            strapi.log.error(`Failed to delete work ${result.id} from Typesense: ${error}`);
        }
    },

    async afterDeleteMany(event) {
        const { params } = event;

        const ids = params.where.$and[0].id.$in;

        for (const id of ids) {
            try {
                await deleteWorkFromTypesense(id);
            } catch (error) {
                strapi.log.error(`Failed to delete work ${id} from Typesense: ${error}`);
            }
        }
    },
};