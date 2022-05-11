/* eslint-disable no-undef */
/**
 * Created by Abass Makinde.
 * objective: building to scale
 */

require('dotenv').config();
const express = require('express');

const cors = require('cors');
const serviceLocator = require('./src/config/di');
const messageModule = require('./src/messages/message.module');
const config = require('./src/config/configuration');
const messageRoutes = require('./src/messages/message.route');
const viewEngine = require('./src/config/viewEngine');

const logger = serviceLocator.get('logger');
const requestLogger = serviceLocator.get('requestlogger');

const server = express();


/**
 * Middleware
 */
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cors());

viewEngine(server);
// setup requests logging
server.use(requestLogger);

// setting up Routes
messageRoutes.setup(server, messageModule);

server.listen(config.port, () => {
  logger.info(`${config.appName} is listening on ${config.port}`);
});

module.exports = server;

// localhost:3000/webhook
// makinde2022
