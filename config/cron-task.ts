export default {
    myJob: {
        task: async ({ strapi }) => {
            try {
                await strapi.service('api::stripe.stripe').sendRenewalReminders();
            } catch (error) {
                strapi.log.error('Cron job failed - subscription renewal reminders:', error);
            }
        },
        options: {
            rule: "0 0 * * *",
        },
    },
};