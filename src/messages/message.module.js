/* eslint-disable no-shadow */
/**
 * Created by Abass Makinde
 * objective: building to scale
 */
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const Response = require('../constant/response');
const config = require('../config/configuration');
const serviceLocator = require('../lib/serviceLocator');

const messageService = require('./message.service');
const messageController = require('./message.controller');

serviceLocator.register('mongo', (serviceLocator) => {
  const logger = serviceLocator.get('logger');
  const connectionString = config.mongo.connection.url;
  mongoose.Promise = bluebird;
  const mongo = mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
    .then(() => {
      logger.info('Mongo Connection Established');
    }).catch((err) => {
      logger.error(`Mongo Connection Error : ${err}`);
    });

  return mongo;
});

// Service instance
serviceLocator.register('messageService', () => {
  const logger = serviceLocator.get('logger');
  const mongoClient = serviceLocator.get('mongo');
  return new messageService(logger, mongoClient);
});

// Controller instance
serviceLocator.register('messageController', (serviceLocator) => {
  const logger = serviceLocator.get('logger');
  const service = serviceLocator.get('messageService');
  return new messageController(logger, Response, service);
});

module.exports = serviceLocator;
