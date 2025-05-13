import cronTask from './cron-task';

export default ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  url: env('URL', 'https://api.pianomusicdatabase.com'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: cronTask,
  },
});
