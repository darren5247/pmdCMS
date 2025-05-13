export default [
  'strapi::errors',
  //'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '256mb',
      formLimit: '256mb',
      textLimit: '256mb',
      strict: true,
      // To handle raw body for webhook route
      patchKoa: true,
      multipart: true,
      includeUnparsed: true
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'https:',
            'data:',
            'blob:',
            'pianodbcms.s3.us-east-1.amazonaws.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'pianodbcms.s3.us-east-1.amazonaws.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
