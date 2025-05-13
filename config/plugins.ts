export default ({ env }) => ({
  email: {
    config: {
      provider: env('EMAIL_PROVIDER'),
      providerOptions: {
        apiKey: env('EMAIL_API_KEY'),
      },
      settings: {
        defaultSenderEmail: env('EMAIL_DEFAULT_SENDER_EMAIL'),
        defaultSenderName: env('EMAIL_DEFAULT_SENDER_NAME'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO'),
      },
    }
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET_NAME'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});