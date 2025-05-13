const { getService } = require('@strapi/plugin-users-permissions/server/utils/index.js');
const _ = require('lodash');

export default {
    async afterCreate(event) {    // Connected to "Save" button in admin panel
        const { data, where, select, populate, state } = event.params;
        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
        const emailSettings = await pluginStore.get({ key: 'email' });
        const newWorkEmailSettings = _.get(emailSettings, 'new_feedback_email_notif.options', {});
        const formattedDateBody = data.createdAt.toLocaleString();
        console.log(data);
        console.log(event);
        //if ( event.result.createdBy.firstname === undefined ) { //added by api
        if ( data.createdBy === undefined ) { //added by api
                    try {
                        const emailBody = await getService('users-permissions').template(
                                newWorkEmailSettings.message,
                                {
                                    FEEDBACK: event.result.feedbackText,
                                    FEEDBACK_TYPE: event.result.feedbackType,
                                    TIMESTAMP: formattedDateBody,
                                    CREATEDBY: `<a href='mailto:${data.users.email}'>${data.users.username}</a>`
                                }
                        )
                        const newWorkEmailToSend = {
                            to: newWorkEmailSettings.response_email,
                            from: newWorkEmailSettings.from.email,
                            replyTo: newWorkEmailSettings.response_email,
                            subject: `${data.users.email} has sent in feedback.`,
                            text: emailBody,
                            html: emailBody
                        }
                        await strapi.plugin('email').service('email').send(newWorkEmailToSend);

                    } catch(err) {
                        console.log(err);
                    }
                } else { // manually added in strapi
                    try {
                        const emailBody = await getService('users-permissions').template(
                                newWorkEmailSettings.message,
                                {
                                    FEEDBACK: event.result.feedbackText,
                                    FEEDBACK_TYPE: event.result.feedbackType,
                                    TIMESTAMP: formattedDateBody,
                                    CREATEDBY: `<a href='mailto:${event.result.createdBy.email}'>${event.result.createdBy.firstname} ${event.result.createdBy.lastname}</a>`
                                }
                        )
                        const newWorkEmailToSend = {
                            to: newWorkEmailSettings.response_email,
                            from: newWorkEmailSettings.from.email,
                            replyTo: newWorkEmailSettings.response_email,
                            subject: `${event.result.createdBy.email} has sent in feedback.`,
                            text: emailBody,
                            html: emailBody
                        }
                        await strapi.plugin('email').service('email').send(newWorkEmailToSend);
                    } catch(err) {
                            console.log(err);
                    }
          }
    }
}
