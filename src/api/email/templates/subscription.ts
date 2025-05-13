import { EmailTemplate } from './types';

export const subscriptionTemplates: Record<string, EmailTemplate> = {
  subscriptionStart: {
    subject: 'Welcome to Your Piano Music Database Subscription!',
    html: `
      <h3>Welcome to Piano Music Database!</h3>
      <p>Your subscription has started.</p>
      <p>Plan: {{planName}}</p>
      <p>Start Date: {{startDate}}</p>
      <p>Next Billing Date: {{nextBillingDate}}</p>
      <p>Amount: {{currency}} {{amount}}</p>
    `,
    text: 'Welcome to Piano Music Database!\nYour subscription has started.\nPlan: {{planName}}\nStart Date: {{startDate}}\nNext Billing Date: {{nextBillingDate}}\nAmount: {{currency}} {{amount}}'
  },
  subscriptionRenew: {
    subject: 'Your Piano Music Database Subscription Has Been Renewed',
    html: `
      <h3>Subscription Renewed</h3>
      <p>Your subscription has been successfully renewed.</p>
      <p>Plan: {{planName}}</p>
      <p>Renewal Date: {{renewalDate}}</p>
      <p>Next Billing Date: {{nextBillingDate}}</p>
      <p>Amount: {{currency}} {{amount}}</p>
    `,
    text: 'Your subscription has been renewed.\nPlan: {{planName}}\nRenewal Date: {{renewalDate}}\nNext Billing Date: {{nextBillingDate}}\nAmount: {{currency}} {{amount}}'
  },
  subscriptionRenewalFailed: {
    subject: 'Action Required: Your Piano Music Database Subscription Payment Failed',
    html: `
      <h3>Subscription Payment Failed</h3>
      <p>We were unable to process your subscription payment.</p>
      <p>Plan: {{planName}}</p>
      <p>Amount: {{currency}} {{amount}}</p>
      <p><strong>Reason:</strong> {{failureReason}}</p>
      <p>We will automatically attempt to process your payment again on {{nextAttemptDate}}.</p>
      <p>To ensure uninterrupted access to Piano Music Database:</p>
      <ul>
        <li>Please verify your payment method is valid and has sufficient funds</li>
        <li>Check if your card hasn't expired</li>
        <li>Update your payment information in your account settings if needed</li>
      </ul>
      <p>If you need assistance, please contact our support team.</p>
    `,
    text: 'Your subscription payment has failed.\n\nPlan: {{planName}}\nAmount: {{currency}} {{amount}}\nReason: {{failureReason}}\n\nWe will automatically attempt to process your payment again on {{nextAttemptDate}}.\n\nTo ensure uninterrupted access to Piano Music Database:\n- Please verify your payment method is valid and has sufficient funds\n- Check if your card hasn\'t expired\n- Update your payment information in your account settings if needed\n\nIf you need assistance, please contact our support team.'
  },
  subscriptionRenewalReminder: {
    subject: 'Your Piano Music Database Subscription Will Renew Soon',
    html: `
      <h3>Subscription Renewal Reminder</h3>
      <p>Your subscription will renew in 14 days.</p>
      <p>Plan: {{planName}}</p>
      <p>Renewal Date: {{renewalDate}}</p>
      <p>Amount: {{currency}} {{amount}}</p>
    `,
    text: 'Your subscription will renew in 14 days.\nPlan: {{planName}}\nRenewal Date: {{renewalDate}}\nAmount: {{currency}} {{amount}}'
  },
  subscriptionCancel: {
    subject: 'Your Piano Music Database Subscription Has Been Cancelled',
    html: `
      <h3>Subscription Cancelled</h3>
      <p>Your subscription has been cancelled.</p>
      <p>Plan: {{planName}}</p>
      <p>Access until: {{endDate}}</p>
    `,
    text: 'Your subscription has been cancelled.\nPlan: {{planName}}\nAccess until: {{endDate}}'
  },
  subscriptionEnd: {
    subject: 'Your Piano Music Database Subscription Has Ended',
    html: `
      <h3>Subscription Ended</h3>
      <p>Your subscription has ended.</p>
      <p>Plan: {{planName}}</p>
      <p>End Date: {{endDate}}</p>
    `,
    text: 'Your subscription has ended.\nPlan: {{planName}}\nEnd Date: {{endDate}}'
  },
  paymentMethodUpdate: {
    subject: 'Your Payment Method Has Been Updated',
    html: `
      <h3>Payment Method Updated</h3>
      <p>Your payment method has been updated.</p>
      <p>Card: {{brand}} ending in {{last4}}</p>
      <p>Expiry: {{expiryDate}}</p>
    `,
    text: 'Your payment method has been updated.\nCard: {{brand}} ending in {{last4}}\nExpiry: {{expiryDate}}'
  },
  subscriptionUpdate: {
    subject: 'Your Piano Music Database Subscription Has Been Updated',
    html: `
      <h3>Subscription Plan Updated</h3>
      <p>Your subscription has been successfully updated.</p>
      <p>New Plan: {{planName}}</p>
      <p>Amount: {{currency}} {{amount}}</p>
      <p>Next Billing Date: {{nextBillingDate}}</p>
      <p>Thank you for being a valued member of Piano Music Database!</p>
    `,
    text: 'Your subscription has been successfully updated.\nNew Plan: {{planName}}\nAmount: {{currency}} {{amount}}\nNext Billing Date: {{nextBillingDate}}\nThank you for being a valued member of Piano Music Database!'
  },
  subscriptionRenewed: {
    subject: 'Your Piano Music Database Subscription Has Been Renewed',
    html: `
      <h3>Subscription Successfully Renewed</h3>
      <p>Thank you for renewing your subscription!</p>
      <p>Plan: {{planName}}</p>
      <p>Amount: {{currency}} {{amount}}</p>
      <p>Next Billing Date: {{nextBillingDate}}</p>
      <p>We're glad to have you continue as a valued member of Piano Music Database!</p>
    `,
    text: 'Thank you for renewing your subscription!\nPlan: {{planName}}\nAmount: {{currency}} {{amount}}\nNext Billing Date: {{nextBillingDate}}\nWe\'re glad to have you continue as a valued member of Piano Music Database!'
  }
}; 