import { Strapi } from '@strapi/strapi';
import { emailTemplates, EmailTemplateData, TemplateNames, SubscriptionTemplateNames } from '../templates';

type WorkNotificationType = 'newWorkAdded' | 'workPublishStatusChanged' | 'workEdited' | 'editStatusChanged';
type EditNotificationType = 'workEdited' | 'editStatusChanged';

export default ({ strapi }: { strapi: Strapi }) => ({
  async sendTemplatedEmail(
    templateName: TemplateNames | SubscriptionTemplateNames,
    to: string,
    data: EmailTemplateData
  ) {
    try {
      const template = emailTemplates[templateName];
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      // Replace variables in template
      const processTemplate = (content: string) => {
        return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          return String(data[key] || match);
        });
      };

      // Send email using configured provider
      await strapi.plugins['email'].services.email.send({
        to,
        from: process.env.BREVO_SENDER_EMAIL,
        subject: processTemplate(template.subject),
        html: processTemplate(template.html),
        text: processTemplate(template.text),
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  async sendNotificationEmail(
    userId: number,
    notificationType: 'workNotifications' | 'editNotifications',
    subType: WorkNotificationType | EditNotificationType,
    templateName: TemplateNames,
    templateData: EmailTemplateData
  ) {
    try {
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        userId,
        {
          populate: {
            notificationPreferences: {
              populate: ['workNotificationPreferences', 'editNotificationPreferences']
            }
          }
        }
      );

      if (!user || !user.email) {
        throw new Error('User not found or has no email');
      }

      const preferences = user.notificationPreferences || {
        notificationsEnabled: true,
        workNotifications: true,
        editNotifications: true,
        workNotificationPreferences: {
          newWorkAdded: true,
          workPublishStatus: true,
          workEdited: true,
          editStatusChanged: true
        },
        editNotificationPreferences: {
          workEdited: true,
          editStatusChanged: true
        }
      };

      // Check if emails are globally disabled
      if (!preferences.notificationsEnabled) {
        strapi.log.info(`Skipping email - all emails disabled for user ${userId}`);
        return;
      }

      // Check main notification type
      if (!preferences[notificationType]) {
        strapi.log.info(`Skipping email - ${notificationType} disabled for user ${userId}`);
        return;
      }

      // Check sub-preference
      const subPreferences = notificationType === 'workNotifications' 
        ? preferences.workNotificationPreferences 
        : preferences.editNotificationPreferences;

      if (!subPreferences?.[subType]) {
        strapi.log.info(`Skipping email - ${subType} disabled for user ${userId}`);
        return;
      }

      return this.sendTemplatedEmail(templateName, user.email, templateData);
    } catch (error) {
      strapi.log.error('Notification email sending failed:', error);
      throw error;
    }
  },

  async sendSubscriptionEmail(
    userId: number,
    templateName: SubscriptionTemplateNames,
    templateData: EmailTemplateData
  ) {
    try {
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        userId
      );

      if (!user || !user.email) {
        throw new Error('User not found or has no email');
      }

      return this.sendTemplatedEmail(templateName, user.email, templateData);
    } catch (error) {
      strapi.log.error('Notification email sending failed:', error);
      throw error;
    }
  },
}); 