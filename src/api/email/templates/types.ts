export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailTemplateData {
  [key: string]: string | number | undefined;
}

export type TemplateNames =
  | 'newWork'
  | 'workEdited'
  | 'workPublishStatusChanged'
  | 'editReceived'
  | 'editStatusWorkOwner'
  | 'editStatusEditor';

export type SubscriptionTemplateNames =
  | 'subscriptionStart'
  | 'subscriptionRenew'
  | 'subscriptionRenewalReminder'
  | 'subscriptionRenewalFailed'
  | 'subscriptionCancel'
  | 'subscriptionEnd'
  | 'subscriptionUpdate'
  | 'subscriptionRenewed'
  | 'paymentMethodUpdate';