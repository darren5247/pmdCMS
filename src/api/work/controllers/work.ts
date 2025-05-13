const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::work.work', ({ strapi }) => ({
    async create(ctx: any) {
        try {
            // Call the default create action
            let response: any;
            try {
                response = await super.create(ctx);
            } catch (err) {
                if (err.code === '23505') { // Unique constraint violation
                    strapi.log.error('Duplicate key value violates unique constraint: ' + err.message + ' Key: ' + JSON.stringify(err.detail));
                    ctx.throw(400, 'Duplicate entry');
                } else {
                    throw err;
                }
            }
            const { data } = response;
            const { data: requestData } = ctx.request.body;
            if (!requestData?.users?.id) {
                return response;
            }

            const composers = await strapi.db.query('api::composer.composer').findMany({
                where: { id: { $in: requestData.composers } },
                select: ['name']
            });

            const composerNames = composers.map((c: any) => c.name).join(', ');

            const level = await strapi.db.query('api::level.level').findOne({
                where: { id: requestData.level?.[0] },
                select: ['title']
            });

            await strapi.service('api::email.email').sendNotificationEmail(
                requestData.users.id,
                'workNotifications',
                'newWorkAdded',
                'newWork',
                {
                    userName: requestData.users.username,
                    workTitle: data.attributes.title,
                    level: level?.title,
                    era: data.attributes.Era,
                    composers: composerNames,
                    workId: data.id
                }
            );

            return response;
        } catch (err) {
            strapi.log.error('Failed to send new work email: ' + err.message);
        }
    }
}));
