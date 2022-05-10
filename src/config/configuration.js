const appName = 'Bot-api';

const config = {
  appName,
  appVersion: '0.0.1',
  port: process.env.PORT || 4000,
  outputDir: `${__dirname.replace('app/config', 'logs')}/`,
  mongo: {
    connection: {
      url: process.env.MONGO_DB_URL,
    },
    collections: {
      client: process.env.CLIENT_COLLECTION || 'client',
    },
    queryLimit: process.env.MONGODB_QUERY_LIMIT,
    questionLimit: process.env.QUESTION_LIMIT,
  },
  conversations: {
    greeting: ["hi", "hey", "hello"],
    accept: ["yup", "yes", "yeah", "sure", "yep", "i do"],
    reject: ["no", "nah", "nope", "not now", "maybe later"],
    thanks: ["thanks", "thx", "thank you", "thank you very much", "thanks a lot", "thanks!", "thank you!"],

  }
};
module.exports = config;
