export default {
    async beforeUpdate(event) {
        // Store original status before update - this is used in afterUpdate to check if status changed
        const originalEdit = await strapi.entityService.findOne('api::edit.edit', event.params.where.id);
        event.state.originalStatus = originalEdit.status;
    },

    async afterUpdate(event) {
        const { result, params, state } = event; // State is manually set in beforeUpdate to capture original status

        // Only proceed if status actually changed
        if (!state.originalStatus || params.data.status === state.originalStatus) {
            return;
        }

        try {
            const edit = await strapi.entityService.findOne('api::edit.edit', result.id, {
                populate: {
                    user: {
                        fields: ['id', 'email']
                    },
                    work: {
                        fields: ['title'],
                        populate: {
                            users: {
                                fields: ['id', 'email']
                            }
                        }
                    }
                }
            });

            const workUsers = edit?.work?.users || [];
            const editUser = edit?.user;
            
            if (!workUsers.length && !editUser) {
                strapi.log.info('No users to notify');
                return;
            }

            const templateData = {
                status: edit.status,
                workTitle: edit.work.title,
                type: edit.type,
                field: edit.field,
                currentContent: edit.currentContent,
                newContent: edit.newContent
            };

            const emailService = strapi.service('api::email.email');

            editUser?.id && emailService.sendNotificationEmail(
                editUser.id,
                'editNotifications',
                'editStatusChanged',
                'editStatusEditor',
                templateData
            );

            await Promise.all(workUsers?.map(async (user) => {
                if (user?.id && user?.id !== editUser?.id) {
                    await emailService.sendNotificationEmail(
                        user.id,
                        'editNotifications',
                        'editStatusChanged',
                        'editStatusWorkOwner',
                        templateData
                    );
                }
            }));
        } catch (error) {
            strapi.log.error('Failed to send edit notification email:', error);
        }
    }
}; 