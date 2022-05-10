const morgan = require('morgan');
const loggerSetting = require('./loggerSetting');
const serviceLocator = require('../lib/serviceLocator');
/**
 * Returns an instance of logger
 */
/**
 * Returns an instance of logger for the App
 */
serviceLocator.register('logger', () => loggerSetting);

/**
  * Returns an instance of HTTP requests logger
*/
serviceLocator.register('requestlogger', () => morgan('common'));

module.exports = serviceLocator;
