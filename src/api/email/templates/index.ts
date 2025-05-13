import { workTemplates } from './work';
import { editTemplates } from './edit';
import { subscriptionTemplates } from './subscription';
import { EmailTemplate } from './types';

export const emailTemplates: Record<string, EmailTemplate> = {
  ...workTemplates,
  ...editTemplates,
  ...subscriptionTemplates,
};

export * from './types'; 