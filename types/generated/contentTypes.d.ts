import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    name: Attribute.String;
    subscribedToNewsletter: Attribute.Boolean;
    works: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::work.work'
    >;
    userType: Attribute.String;
    feedbacks: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::feedback.feedback'
    >;
    acceptedTerms: Attribute.Boolean;
    collections: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::collection.collection'
    >;
    composers: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::composer.composer'
    >;
    publishers: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::publisher.publisher'
    >;
    userOccupation: Attribute.String;
    works_ignore_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::work.work'
    >;
    composers_ignore_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::composer.composer'
    >;
    publishers_ignore_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::publisher.publisher'
    >;
    collections_ignore_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::collection.collection'
    >;
    works_watch_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::work.work'
    >;
    composers_watch_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::composer.composer'
    >;
    publishers_watch_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::publisher.publisher'
    >;
    collection_watch_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::collection.collection'
    >;
    ignoreAllNotifications: Attribute.Boolean & Attribute.DefaultTo<false>;
    ignoreAllWorksNotifications: Attribute.Boolean & Attribute.DefaultTo<false>;
    ignoreAllComposersNotifications: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    ignoreAllPublishersNotifications: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    ignoreAllCollectionsNotifications: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    edits: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::edit.edit'
    >;
    subscriptionStatus: Attribute.String;
    subscriptionPlan: Attribute.String;
    subscriptionId: Attribute.String;
    stripeCustomerId: Attribute.UID;
    notificationPreferences: Attribute.Component<'notification.preferences'>;
    lists: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::list.list'
    >;
    nameLast: Attribute.String;
    favorites: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::favorite.favorite'
    >;
    firstLogIn: Attribute.Boolean & Attribute.DefaultTo<false>;
    lists_owned: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::list.list'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAdsenseConfigAdsenseConfig extends Schema.SingleType {
  collectionName: 'adsense_configs';
  info: {
    singularName: 'adsense-config';
    pluralName: 'adsense-configs';
    displayName: 'AdSense Configuration';
    description: 'Google AdSense configuration settings';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    publisherId: Attribute.String & Attribute.Required & Attribute.Unique;
    adUnits: Attribute.Component<'ads.ad-unit', true> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::adsense-config.adsense-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::adsense-config.adsense-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCollectionCollection extends Schema.CollectionType {
  collectionName: 'collections';
  info: {
    singularName: 'collection';
    pluralName: 'collections';
    displayName: 'Collection';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    purchase_link: Attribute.Component<'link.sheet-music-link', true>;
    publishers: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::publisher.publisher'
    >;
    score: Attribute.Media;
    score_link: Attribute.String;
    catalogue_number: Attribute.String;
    series: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::sequence.sequence'
    >;
    published_date: Attribute.String;
    works: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::work.work'
    >;
    adminNotes: Attribute.String;
    adminStatus: Attribute.Enumeration<
      [
        'Issue',
        'Complete',
        'Incomplete',
        'In-Progress',
        'For Review',
        'Reviewed'
      ]
    >;
    purchase_linkStatus: Attribute.Enumeration<['Issue', 'Complete']>;
    description: Attribute.Text;
    image: Attribute.Media;
    composers: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::composer.composer'
    >;
    isbn_10: Attribute.String;
    isbn_13: Attribute.String;
    videoYouTube: Attribute.String;
    composed_date: Attribute.String;
    imageSEO: Attribute.Media;
    feedbacks: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::feedback.feedback'
    >;
    user: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    adminReview: Attribute.Enumeration<
      ['For Review', 'Reviewed', 'Issue', 'Complete']
    >;
    urlSpotify: Attribute.String;
    urlAppleMusic: Attribute.String;
    urlWebsite: Attribute.String;
    edits: Attribute.Relation<
      'api::collection.collection',
      'oneToMany',
      'api::edit.edit'
    >;
    eras: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::era.era'
    >;
    holidays: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::holiday.holiday'
    >;
    instrumentations: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::instrumentation.instrumentation'
    >;
    purchase_links: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::purchase-link.purchase-link'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::collection.collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::collection.collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComposerComposer extends Schema.CollectionType {
  collectionName: 'composers';
  info: {
    singularName: 'composer';
    pluralName: 'composers';
    displayName: 'Composer';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    excerpt: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    birth_year: Attribute.String;
    death_year: Attribute.String;
    nationality: Attribute.String;
    collections: Attribute.Relation<
      'api::composer.composer',
      'manyToMany',
      'api::collection.collection'
    >;
    image: Attribute.Media;
    works: Attribute.Relation<
      'api::composer.composer',
      'manyToMany',
      'api::work.work'
    >;
    feedbacks: Attribute.Relation<
      'api::composer.composer',
      'manyToMany',
      'api::feedback.feedback'
    >;
    users: Attribute.Relation<
      'api::composer.composer',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    adminReview: Attribute.Enumeration<
      ['For Review', 'Reviewed', 'Issue', 'Complete']
    >;
    urlSocialInstagram: Attribute.String;
    urlSocialFacebook: Attribute.String;
    urlSocialX: Attribute.String;
    urlSocialLinkedIn: Attribute.String;
    urlSpotify: Attribute.String;
    urlAppleMusic: Attribute.String;
    urlWebsite: Attribute.String;
    urlSocialYouTube: Attribute.String;
    imageSEO: Attribute.Media;
    gender: Attribute.String;
    pronouns: Attribute.String;
    ethnicity: Attribute.String;
    edits: Attribute.Relation<
      'api::composer.composer',
      'oneToMany',
      'api::edit.edit'
    >;
    eras: Attribute.Relation<
      'api::composer.composer',
      'manyToMany',
      'api::era.era'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::composer.composer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::composer.composer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEditEdit extends Schema.CollectionType {
  collectionName: 'edits';
  info: {
    singularName: 'edit';
    pluralName: 'edits';
    displayName: 'Edit';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    status: Attribute.Enumeration<['Pending Review', 'Approved', 'Rejected']> &
      Attribute.Required;
    type: Attribute.String;
    newContent: Attribute.String;
    currentContent: Attribute.String;
    user: Attribute.Relation<
      'api::edit.edit',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    work: Attribute.Relation<'api::edit.edit', 'manyToOne', 'api::work.work'>;
    collection: Attribute.Relation<
      'api::edit.edit',
      'manyToOne',
      'api::collection.collection'
    >;
    publisher: Attribute.Relation<
      'api::edit.edit',
      'manyToOne',
      'api::publisher.publisher'
    >;
    composer: Attribute.Relation<
      'api::edit.edit',
      'manyToOne',
      'api::composer.composer'
    >;
    field: Attribute.String;
    reason: Attribute.Text;
    reasonRejected: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::edit.edit', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::edit.edit', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiElementElement extends Schema.CollectionType {
  collectionName: 'elements';
  info: {
    singularName: 'element';
    pluralName: 'elements';
    displayName: 'Element';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    level: Attribute.Enumeration<
      [
        'Primary',
        'Early Elementary',
        'Late Elementary',
        'Early Intermediate',
        'Late Intermediate',
        'Advanced',
        'Master'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    illustration: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    rules: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    category: Attribute.Enumeration<
      [
        'Intervals',
        'Notes and Notation',
        'Expression',
        'Rhythm',
        'Scales and Hand Positions',
        'Meter',
        'Hand and Finger Techniques',
        'Texture',
        'Accompaniment Patterns',
        'Chords',
        'Extended Techniques',
        'Improvisation'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    notes: Attribute.Text &
      Attribute.Private &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    illustrationStatus: Attribute.Enumeration<
      ['None', 'Issue', 'In Progress', 'Complete']
    > &
      Attribute.Private &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    featuredElementsIndex: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    Status: Attribute.Enumeration<
      ['In Progress', 'Issue', 'For Review', 'Reviewed']
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    element_categories: Attribute.Relation<
      'api::element.element',
      'manyToMany',
      'api::element-category.element-category'
    >;
    works: Attribute.Relation<
      'api::element.element',
      'manyToMany',
      'api::work.work'
    >;
    levels: Attribute.Relation<
      'api::element.element',
      'manyToMany',
      'api::level.level'
    >;
    elementsRelated: Attribute.Relation<
      'api::element.element',
      'oneToMany',
      'api::element.element'
    >;
    nameAlt: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::element.element',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::element.element',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::element.element',
      'oneToMany',
      'api::element.element'
    >;
    locale: Attribute.String;
  };
}

export interface ApiElementCategoryElementCategory
  extends Schema.CollectionType {
  collectionName: 'element_categories';
  info: {
    singularName: 'element-category';
    pluralName: 'element-categories';
    displayName: 'Element Category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    elements: Attribute.Relation<
      'api::element-category.element-category',
      'manyToMany',
      'api::element.element'
    >;
    name: Attribute.String & Attribute.Required;
    status: Attribute.Enumeration<['Needs Review', 'Under Review', 'Reviewed']>;
    publicDescription: Attribute.Text;
    internalDescription: Attribute.Text;
    internalNotes: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::element-category.element-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::element-category.element-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEraEra extends Schema.CollectionType {
  collectionName: 'eras';
  info: {
    singularName: 'era';
    pluralName: 'eras';
    displayName: 'Era';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    works: Attribute.Relation<'api::era.era', 'manyToMany', 'api::work.work'>;
    visibility: Attribute.Relation<
      'api::era.era',
      'manyToOne',
      'api::visibility.visibility'
    >;
    collections: Attribute.Relation<
      'api::era.era',
      'manyToMany',
      'api::collection.collection'
    >;
    composers: Attribute.Relation<
      'api::era.era',
      'manyToMany',
      'api::composer.composer'
    >;
    order: Attribute.Integer & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::era.era', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::era.era', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiFavoriteFavorite extends Schema.CollectionType {
  collectionName: 'favorites';
  info: {
    singularName: 'favorite';
    pluralName: 'favorites';
    displayName: 'Favorite';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::favorite.favorite',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    work: Attribute.Relation<
      'api::favorite.favorite',
      'manyToOne',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::favorite.favorite',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::favorite.favorite',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFeedbackFeedback extends Schema.CollectionType {
  collectionName: 'feedbacks';
  info: {
    singularName: 'feedback';
    pluralName: 'feedbacks';
    displayName: 'Feedback';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    feedbackText: Attribute.Text;
    feedbackType: Attribute.String;
    users: Attribute.Relation<
      'api::feedback.feedback',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    works: Attribute.Relation<
      'api::feedback.feedback',
      'manyToMany',
      'api::work.work'
    >;
    composers: Attribute.Relation<
      'api::feedback.feedback',
      'manyToMany',
      'api::composer.composer'
    >;
    publishers: Attribute.Relation<
      'api::feedback.feedback',
      'manyToMany',
      'api::publisher.publisher'
    >;
    collections: Attribute.Relation<
      'api::feedback.feedback',
      'manyToMany',
      'api::collection.collection'
    >;
    pages: Attribute.Relation<
      'api::feedback.feedback',
      'manyToMany',
      'api::page.page'
    >;
    feedbackEmail: Attribute.String;
    feedbackStatus: Attribute.Enumeration<
      ['For Review', 'In Progress', 'Closed']
    >;
    feedbackNotes: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::feedback.feedback',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::feedback.feedback',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHolidayHoliday extends Schema.CollectionType {
  collectionName: 'holidays';
  info: {
    singularName: 'holiday';
    pluralName: 'holidays';
    displayName: 'Holiday';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    collections: Attribute.Relation<
      'api::holiday.holiday',
      'manyToMany',
      'api::collection.collection'
    >;
    works: Attribute.Relation<
      'api::holiday.holiday',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::holiday.holiday',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::holiday.holiday',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomepageBannerHomepageBanner extends Schema.SingleType {
  collectionName: 'homepage_banners';
  info: {
    singularName: 'homepage-banner';
    pluralName: 'homepage-banners';
    displayName: 'Homepage Banner';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    BannerImage: Attribute.Media & Attribute.Required;
    BannerLink: Attribute.String;
    BannerLinkTitle: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage-banner.homepage-banner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage-banner.homepage-banner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInstrumentationInstrumentation
  extends Schema.CollectionType {
  collectionName: 'instrumentations';
  info: {
    singularName: 'instrumentation';
    pluralName: 'instrumentations';
    displayName: 'Instrumentation';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    collections: Attribute.Relation<
      'api::instrumentation.instrumentation',
      'manyToMany',
      'api::collection.collection'
    >;
    works: Attribute.Relation<
      'api::instrumentation.instrumentation',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::instrumentation.instrumentation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::instrumentation.instrumentation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiKeySignatureKeySignature extends Schema.CollectionType {
  collectionName: 'key_signatures';
  info: {
    singularName: 'key-signature';
    pluralName: 'key-signatures';
    displayName: 'Key Signature';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    works: Attribute.Relation<
      'api::key-signature.key-signature',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::key-signature.key-signature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::key-signature.key-signature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLevelLevel extends Schema.CollectionType {
  collectionName: 'levels';
  info: {
    singularName: 'level';
    pluralName: 'levels';
    displayName: 'Level';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.RichText;
    isFeatured: Attribute.Boolean;
    isSearchable: Attribute.Boolean;
    works: Attribute.Relation<
      'api::level.level',
      'oneToMany',
      'api::work.work'
    >;
    elements: Attribute.Relation<
      'api::level.level',
      'manyToMany',
      'api::element.element'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::level.level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::level.level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiListList extends Schema.CollectionType {
  collectionName: 'lists';
  info: {
    singularName: 'list';
    pluralName: 'lists';
    displayName: 'List';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    uid: Attribute.Integer & Attribute.Required & Attribute.Unique;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 144;
      }>;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    details: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    visibility: Attribute.Relation<
      'api::list.list',
      'manyToOne',
      'api::visibility.visibility'
    >;
    users: Attribute.Relation<
      'api::list.list',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    list_works: Attribute.Relation<
      'api::list.list',
      'oneToMany',
      'api::list-work.list-work'
    >;
    owners: Attribute.Relation<
      'api::list.list',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    community: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::list.list', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::list.list', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiListWorkListWork extends Schema.CollectionType {
  collectionName: 'list_works';
  info: {
    singularName: 'list-work';
    pluralName: 'list-works';
    displayName: 'ListWork';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    work: Attribute.Relation<
      'api::list-work.list-work',
      'manyToOne',
      'api::work.work'
    >;
    order: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    notes: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    list: Attribute.Relation<
      'api::list-work.list-work',
      'manyToOne',
      'api::list.list'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::list-work.list-work',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::list-work.list-work',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMoodMood extends Schema.CollectionType {
  collectionName: 'moods';
  info: {
    singularName: 'mood';
    pluralName: 'moods';
    displayName: 'Mood';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    popularFiltersIndex: Attribute.Integer;
    works: Attribute.Relation<'api::mood.mood', 'manyToMany', 'api::work.work'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::mood.mood', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::mood.mood', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: 'pages';
  info: {
    singularName: 'page';
    pluralName: 'pages';
    displayName: 'Page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    descriptionSEO: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    image: Attribute.Media;
    content: Attribute.RichText & Attribute.Required;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    showLastUpdated: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    feedbacks: Attribute.Relation<
      'api::page.page',
      'manyToMany',
      'api::feedback.feedback'
    >;
    hideName: Attribute.Boolean;
    widthFull: Attribute.Boolean;
    showBackBar: Attribute.Boolean & Attribute.DefaultTo<true>;
    showBackBarShare: Attribute.Boolean & Attribute.DefaultTo<true>;
    showBackBarFeedback: Attribute.Boolean & Attribute.DefaultTo<true>;
    isUserLoggedIn: Attribute.Boolean;
    isUserPMDPlus: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPromotedWorkPromotedWork extends Schema.SingleType {
  collectionName: 'promoted_works';
  info: {
    singularName: 'promoted-work';
    pluralName: 'promoted-works';
    displayName: 'Promoted Work';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    sponsoredWork: Attribute.Component<'sponsored-work.sponsored-work', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::promoted-work.promoted-work',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::promoted-work.promoted-work',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPublisherPublisher extends Schema.CollectionType {
  collectionName: 'publishers';
  info: {
    singularName: 'publisher';
    pluralName: 'publishers';
    displayName: 'Publisher';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    collections: Attribute.Relation<
      'api::publisher.publisher',
      'manyToMany',
      'api::collection.collection'
    >;
    series: Attribute.Relation<
      'api::publisher.publisher',
      'manyToMany',
      'api::sequence.sequence'
    >;
    works: Attribute.Relation<
      'api::publisher.publisher',
      'manyToMany',
      'api::work.work'
    >;
    feedbacks: Attribute.Relation<
      'api::publisher.publisher',
      'manyToMany',
      'api::feedback.feedback'
    >;
    users: Attribute.Relation<
      'api::publisher.publisher',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    excerpt: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    nationality: Attribute.String;
    image: Attribute.Media;
    adminReview: Attribute.Enumeration<
      ['For Review', 'Reviewed', 'Issue', 'Complete']
    >;
    urlSocialInstagram: Attribute.String;
    urlSocialFacebook: Attribute.String;
    urlSocialX: Attribute.String;
    urlSocialLinkedIn: Attribute.String;
    urlSpotify: Attribute.String;
    urlAppleMusic: Attribute.String;
    urlWebsite: Attribute.String;
    urlSocialYouTube: Attribute.String;
    imageSEO: Attribute.Media;
    edits: Attribute.Relation<
      'api::publisher.publisher',
      'oneToMany',
      'api::edit.edit'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::publisher.publisher',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::publisher.publisher',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPurchaseLinkPurchaseLink extends Schema.CollectionType {
  collectionName: 'purchase_links';
  info: {
    singularName: 'purchase-link';
    pluralName: 'purchase-links';
    displayName: 'Purchase Link';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    sellerName: Attribute.String;
    url: Attribute.String;
    linkText: Attribute.String;
    sellerImage: Attribute.Media;
    price: Attribute.Decimal;
    works: Attribute.Relation<
      'api::purchase-link.purchase-link',
      'manyToMany',
      'api::work.work'
    >;
    collections: Attribute.Relation<
      'api::purchase-link.purchase-link',
      'manyToMany',
      'api::collection.collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::purchase-link.purchase-link',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::purchase-link.purchase-link',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSequenceSequence extends Schema.CollectionType {
  collectionName: 'sequences';
  info: {
    singularName: 'sequence';
    pluralName: 'sequences';
    displayName: 'Series';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    works: Attribute.Relation<
      'api::sequence.sequence',
      'manyToMany',
      'api::work.work'
    >;
    collections: Attribute.Relation<
      'api::sequence.sequence',
      'manyToMany',
      'api::collection.collection'
    >;
    publishers: Attribute.Relation<
      'api::sequence.sequence',
      'manyToMany',
      'api::publisher.publisher'
    >;
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sequence.sequence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sequence.sequence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStudentAgeStudentAge extends Schema.CollectionType {
  collectionName: 'student_ages';
  info: {
    singularName: 'student-age';
    pluralName: 'student-ages';
    displayName: 'Student Age';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    works: Attribute.Relation<
      'api::student-age.student-age',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::student-age.student-age',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::student-age.student-age',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStudentTypeStudentType extends Schema.CollectionType {
  collectionName: 'student_types';
  info: {
    singularName: 'student-type';
    pluralName: 'student-types';
    displayName: 'Student Type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    works: Attribute.Relation<
      'api::student-type.student-type',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::student-type.student-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::student-type.student-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStyleStyle extends Schema.CollectionType {
  collectionName: 'styles';
  info: {
    singularName: 'style';
    pluralName: 'styles';
    displayName: 'Style';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    popularFiltersIndex: Attribute.Integer;
    works: Attribute.Relation<
      'api::style.style',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::style.style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::style.style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionReminderSubscriptionReminder
  extends Schema.CollectionType {
  collectionName: 'subscription_reminders';
  info: {
    singularName: 'subscription-reminder';
    pluralName: 'subscription-reminders';
    displayName: 'Subscription Reminder';
    description: 'Track sent subscription renewal reminders';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    subscriptionId: Attribute.String & Attribute.Required;
    sentAt: Attribute.DateTime & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription-reminder.subscription-reminder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription-reminder.subscription-reminder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTeachingTipTeachingTip extends Schema.CollectionType {
  collectionName: 'teaching_tips';
  info: {
    singularName: 'teaching-tip';
    pluralName: 'teaching-tips';
    displayName: 'Teaching Tip';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    works: Attribute.Relation<
      'api::teaching-tip.teaching-tip',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::teaching-tip.teaching-tip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::teaching-tip.teaching-tip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTempoIndicationTempoIndication
  extends Schema.CollectionType {
  collectionName: 'tempo_indications';
  info: {
    singularName: 'tempo-indication';
    pluralName: 'tempo-indications';
    displayName: 'Tempo Indication ';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    works: Attribute.Relation<
      'api::tempo-indication.tempo-indication',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tempo-indication.tempo-indication',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tempo-indication.tempo-indication',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiThemeTheme extends Schema.CollectionType {
  collectionName: 'themes';
  info: {
    singularName: 'theme';
    pluralName: 'themes';
    displayName: 'Theme';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    works: Attribute.Relation<
      'api::theme.theme',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::theme.theme',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::theme.theme',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTimeSignatureTimeSignature extends Schema.CollectionType {
  collectionName: 'time_signatures';
  info: {
    singularName: 'time-signature';
    pluralName: 'time-signatures';
    displayName: 'Time Signature';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    works: Attribute.Relation<
      'api::time-signature.time-signature',
      'manyToMany',
      'api::work.work'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::time-signature.time-signature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::time-signature.time-signature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTooltipTooltip extends Schema.CollectionType {
  collectionName: 'tooltips';
  info: {
    singularName: 'tooltip';
    pluralName: 'tooltips';
    displayName: 'Tooltip';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    tooltipText: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    tooltipTitle: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    tooltipLocation: Attribute.Enumeration<
      [
        'AddWork',
        'AddComposer',
        'AddCollection',
        'AddPublisher',
        'Search',
        'Dashboard'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tooltip.tooltip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tooltip.tooltip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::tooltip.tooltip',
      'oneToMany',
      'api::tooltip.tooltip'
    >;
    locale: Attribute.String;
  };
}

export interface ApiVisibilityVisibility extends Schema.CollectionType {
  collectionName: 'visibilities';
  info: {
    singularName: 'visibility';
    pluralName: 'visibilities';
    displayName: 'Visibility';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    currentVisibility: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'unlisted'>;
    lists: Attribute.Relation<
      'api::visibility.visibility',
      'oneToMany',
      'api::list.list'
    >;
    eras: Attribute.Relation<
      'api::visibility.visibility',
      'oneToMany',
      'api::era.era'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::visibility.visibility',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::visibility.visibility',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWorkWork extends Schema.CollectionType {
  collectionName: 'works';
  info: {
    singularName: 'work';
    pluralName: 'works';
    displayName: 'Work';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.SetMinMaxLength<{
        maxLength: 2048;
      }>;
    score: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    measureCount: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.SetMinMax<{
        max: 9999;
      }>;
    hasLyrics: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    yearPublished: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    elements: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::element.element'
    >;
    Era: Attribute.Enumeration<
      [
        'Twentieth Century',
        'Baroque',
        'Classical',
        'Modern',
        'Romantic',
        'none',
        'Medieval',
        'Renaissance',
        'Late Romantic'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sheetMusicLinks: Attribute.DynamicZone<['link.sheet-music-link']> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    Holiday: Attribute.Enumeration<
      ['Christmas', 'Easter', 'Halloween', 'Fourth of July', 'None']
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    videoEmbedCode: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.SetMinMaxLength<{
        maxLength: 2048;
      }>;
    video: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    alternateTitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.SetMinMaxLength<{
        maxLength: 2048;
      }>;
    publishers: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::publisher.publisher'
    >;
    instrumentation: Attribute.Enumeration<
      [
        'Solo Piano',
        'Four Hands',
        'Piano and Cello',
        'Two Pianos',
        'Piano Ensemble'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    styles: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::style.style'
    >;
    level: Attribute.Relation<
      'api::work.work',
      'manyToOne',
      'api::level.level'
    >;
    moods: Attribute.Relation<'api::work.work', 'manyToMany', 'api::mood.mood'>;
    teachingTips: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::teaching-tip.teaching-tip'
    >;
    series: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::sequence.sequence'
    >;
    hasTeacherDuet: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    themes: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::theme.theme'
    >;
    excerptStatus: Attribute.Enumeration<
      ['None', 'In Progress', 'Complete', 'Issue']
    > &
      Attribute.Private &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    scoreStatus: Attribute.Enumeration<
      ['None', 'In Progress', 'Issue', 'Complete']
    > &
      Attribute.Private &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    scoreExcerpt: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    adminReview: Attribute.Enumeration<
      ['For Review', 'Reviewed', 'Issue', 'Complete']
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    timeSignatures: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::time-signature.time-signature'
    >;
    keySignatures: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::key-signature.key-signature'
    >;
    notesForAdmin: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    studentAges: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::student-age.student-age'
    >;
    studentTypes: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::student-type.student-type'
    >;
    elementStatus: Attribute.Enumeration<['Elements Missing']> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    adminNotes: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    tempoIndications: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::tempo-indication.tempo-indication'
    >;
    collections: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::collection.collection'
    >;
    newElementSuggestions: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    users: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    isFeatured: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    popularPiecesIndex: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    composers: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::composer.composer'
    >;
    image: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    imageSEO: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    feedbacks: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::feedback.feedback'
    >;
    promoText: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    urlSpotify: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    urlAppleMusic: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    DM_Status: Attribute.Enumeration<['For Review', 'Reviewed', 'Issue']> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    DM_Notes: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    edits: Attribute.Relation<'api::work.work', 'oneToMany', 'api::edit.edit'>;
    eras: Attribute.Relation<'api::work.work', 'manyToMany', 'api::era.era'>;
    favorites: Attribute.Relation<
      'api::work.work',
      'oneToMany',
      'api::favorite.favorite'
    >;
    purchase_links: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::purchase-link.purchase-link'
    >;
    list_works: Attribute.Relation<
      'api::work.work',
      'oneToMany',
      'api::list-work.list-work'
    >;
    holidays: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::holiday.holiday'
    >;
    instrumentations: Attribute.Relation<
      'api::work.work',
      'manyToMany',
      'api::instrumentation.instrumentation'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::work.work', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::work.work', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::work.work',
      'oneToMany',
      'api::work.work'
    >;
    locale: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::adsense-config.adsense-config': ApiAdsenseConfigAdsenseConfig;
      'api::collection.collection': ApiCollectionCollection;
      'api::composer.composer': ApiComposerComposer;
      'api::edit.edit': ApiEditEdit;
      'api::element.element': ApiElementElement;
      'api::element-category.element-category': ApiElementCategoryElementCategory;
      'api::era.era': ApiEraEra;
      'api::favorite.favorite': ApiFavoriteFavorite;
      'api::feedback.feedback': ApiFeedbackFeedback;
      'api::holiday.holiday': ApiHolidayHoliday;
      'api::homepage-banner.homepage-banner': ApiHomepageBannerHomepageBanner;
      'api::instrumentation.instrumentation': ApiInstrumentationInstrumentation;
      'api::key-signature.key-signature': ApiKeySignatureKeySignature;
      'api::level.level': ApiLevelLevel;
      'api::list.list': ApiListList;
      'api::list-work.list-work': ApiListWorkListWork;
      'api::mood.mood': ApiMoodMood;
      'api::page.page': ApiPagePage;
      'api::promoted-work.promoted-work': ApiPromotedWorkPromotedWork;
      'api::publisher.publisher': ApiPublisherPublisher;
      'api::purchase-link.purchase-link': ApiPurchaseLinkPurchaseLink;
      'api::sequence.sequence': ApiSequenceSequence;
      'api::student-age.student-age': ApiStudentAgeStudentAge;
      'api::student-type.student-type': ApiStudentTypeStudentType;
      'api::style.style': ApiStyleStyle;
      'api::subscription-reminder.subscription-reminder': ApiSubscriptionReminderSubscriptionReminder;
      'api::teaching-tip.teaching-tip': ApiTeachingTipTeachingTip;
      'api::tempo-indication.tempo-indication': ApiTempoIndicationTempoIndication;
      'api::theme.theme': ApiThemeTheme;
      'api::time-signature.time-signature': ApiTimeSignatureTimeSignature;
      'api::tooltip.tooltip': ApiTooltipTooltip;
      'api::visibility.visibility': ApiVisibilityVisibility;
      'api::work.work': ApiWorkWork;
    }
  }
}
