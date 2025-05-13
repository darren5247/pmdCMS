/**
 * edit controller
 */

import { factories } from '@strapi/strapi'

module.exports = factories.createCoreController('api::edit.edit', ({ strapi }) => ({
    async create(ctx) {
        const response = await super.create(ctx);
        const { data } = response;

        try {
            // Get edit details with related users
            const edit = await strapi.db.query('api::edit.edit').findOne({
                where: { id: data.id },
                populate: {
                    user: { select: ['id', 'email', 'username'] },
                    work: {
                        populate: {
                            users: { select: ['id', 'email', 'username'] }
                        },
                        select: ['title']
                    },
                }
            });

            const workUsers = edit?.work?.users || [];
            const editUser = edit?.user;

            if (!workUsers.length && !editUser) {
                strapi.log.info('No users to notify');
                return;
            }

            const templateData = {
                workTitle: edit.work.title,
                editType: edit.type,
                editField: edit.field,
                currentContent: edit.currentContent,
                newContent: edit.newContent,
                editorName: editUser.username
            };

            const emailService = strapi.service('api::email.email');

            // Check if editor is among work users
            const isEditorAmongWorkUsers = workUsers?.some(user => user?.id === editUser?.id);

            // Send notification to editor
            if (editUser?.id) {
                await emailService.sendNotificationEmail(
                    editUser.id,
                    'editNotifications',
                    'workEdited',
                    'editReceived',
                    {
                        ...templateData,
                        messagePrefix: isEditorAmongWorkUsers ? 'You have edited your work' : 'You have edited'
                    }
                );
            }

            await Promise.all(workUsers?.map(async (user) => {
                if (user?.id && user?.id !== editUser?.id) {
                    await emailService.sendNotificationEmail(
                        user.id,
                        'editNotifications',
                        'workEdited',
                        'workEdited',
                        templateData
                    );
                }
            }));

        } catch (err) {
            strapi.log.error('Failed to send edit notification email: ' + err.message);
        }

        return response;
    }
}));