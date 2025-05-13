import type { Schema, Attribute } from '@strapi/strapi';

export interface AdsAdUnit extends Schema.Component {
  collectionName: 'components_ads_ad_units';
  info: {
    displayName: 'Ad Unit';
    description: 'Configuration for individual ad units';
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 50;
      }>;
    slot: Attribute.String & Attribute.Required;
    format: Attribute.Enumeration<
      ['auto', 'horizontal', 'vertical', 'rectangle']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'auto'>;
    responsive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    location: Attribute.Enumeration<
      ['work_page_above_video', 'work_page_below_video', 'home_page_top']
    > &
      Attribute.Required;
  };
}

export interface LinkSheetMusicLink extends Schema.Component {
  collectionName: 'components_link_sheet_music_links';
  info: {
    displayName: 'Sheet Music Link';
    icon: 'external-link-alt';
    description: '';
  };
  attributes: {
    sellerName: Attribute.String;
    url: Attribute.Text;
    linkText: Attribute.String;
    sellerImage: Attribute.Media;
    price: Attribute.Decimal;
  };
}

export interface NotificationEditPreferences extends Schema.Component {
  collectionName: 'components_notification_edit_preferences';
  info: {
    displayName: 'Edit Notification Preferences';
    description: 'Detailed edit notification preferences';
  };
  options: {
    setDefaultValue: {
      workEdited: true;
      editStatusChanged: true;
    };
  };
  attributes: {
    workEdited: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    editStatusChanged: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
  };
}

export interface NotificationPreferences extends Schema.Component {
  collectionName: 'components_notification_preferences';
  info: {
    displayName: 'Notification Preferences';
    description: 'User notification preferences';
    displayOptions: {
      layout: 'grid';
    };
  };
  options: {
    layouts: {
      edit: [
        [
          {
            name: 'notificationsEnabled';
            size: 12;
          }
        ],
        [
          {
            name: 'workNotifications';
            size: 6;
          },
          {
            name: 'editNotifications';
            size: 6;
          }
        ],
        [
          {
            name: 'workNotificationPreferences';
            size: 12;
          }
        ],
        [
          {
            name: 'editNotificationPreferences';
            size: 12;
          }
        ]
      ];
    };
  };
  attributes: {
    notificationsEnabled: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    workNotifications: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    workNotificationPreferences: Attribute.Component<'notification.work-preferences'> &
      Attribute.Required;
    editNotifications: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    editNotificationPreferences: Attribute.Component<'notification.edit-preferences'> &
      Attribute.Required;
  };
}

export interface NotificationWorkPreferences extends Schema.Component {
  collectionName: 'components_notification_work_preferences';
  info: {
    displayName: 'Work Notification Preferences';
    description: 'Detailed work notification preferences';
  };
  options: {
    setDefaultValue: {
      newWorkAdded: true;
      workPublishStatusChanged: true;
      workEdited: true;
      editStatusChanged: true;
    };
  };
  attributes: {
    newWorkAdded: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    workPublishStatusChanged: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    workEdited: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    editStatusChanged: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
  };
}

export interface SponsoredWorkSponsoredWork extends Schema.Component {
  collectionName: 'components_sponsored_work_sponsored_works';
  info: {
    displayName: 'Sponsored Work';
    icon: 'alien';
    description: '';
  };
  attributes: {
    Category: Attribute.Enumeration<
      [
        'Global',
        'Elements',
        'Level',
        'Era',
        'Moods',
        'Styles',
        'Themes',
        'Holiday ',
        'Instrumentation',
        'Student Ages',
        'Student Types',
        'Has Teacher Duet',
        'Has Lyrics'
      ]
    >;
    work: Attribute.Relation<
      'sponsored-work.sponsored-work',
      'oneToOne',
      'api::work.work'
    >;
    position: Attribute.Integer & Attribute.Required;
    categoryValue: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ads.ad-unit': AdsAdUnit;
      'link.sheet-music-link': LinkSheetMusicLink;
      'notification.edit-preferences': NotificationEditPreferences;
      'notification.preferences': NotificationPreferences;
      'notification.work-preferences': NotificationWorkPreferences;
      'sponsored-work.sponsored-work': SponsoredWorkSponsoredWork;
    }
  }
}
