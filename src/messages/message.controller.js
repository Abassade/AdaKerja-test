/* eslint-disable consistent-return */
const httpStatus = require('../constant/httpStatus');
const config = require('../config/configuration');
const utilService = require('../lib/utils');

class Message {
/**
 *  @param {*} response
 * @param {*} logger
 * @param {*} messageService
 */
  constructor(logger, response, messageService) {
    this.response = response;
    this.logger = logger;
    this.messageService = messageService;
  }

  async getWebhook(req, res) {
    try {
      if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN){
        logger.info('webhook verified', req.query['hub.challenge']);
        return this.response.success(res, {
          message: 'ok',
          data: req.query['hub.challenge'],
        }, httpStatus.OK);
      } 
      logger.error('verification failed. Token mismatch.');
      return this.response.failure(res, {
        message: 'Internal server error',
        response: error,
      }, httpStatus.FORBIDDEN);
    
    } catch (error) {
      this.logger.info(`error: ${error}`);
      return this.response.failure(res, {
        message: 'Internal server error',
        response: error,
      }, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postWebhook(req, res) {
    this.logger.info('received webhook message', req.body);
    try {
      //checking for page subscription.
      if (req.body.object === 'page'){
        /* Iterate over each entry, there can be multiple entries 
        if callbacks are batched. */
        req.body.entry.forEach(function(entry) {
        // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
            logger.info(event);
            if (event.postback){
                // processPostback(event);
            } else if (event.message){
                // processMessage(event);
            }
          });
        });
        res.sendStatus(200);
      }
    } catch (error) {
      this.logger.info(`error: ${error}`);
      return this.response.failure(res, {
        message: 'Internal server error',
        response: error,
      }, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
module.exports = Message;
