/* eslint-disable consistent-return */
const httpStatus = require('../constant/httpStatus');

let USER_FIRST_NAME = "";
let USER_BIRTH_DATE = "";
let LATEST_MESSAGE = "";
let PREV_OF_LATEST = "";
let PREV_OF_PREV = "";
let WEBHOOK_MESS = "";
let SENDER_ID = "";
let COUNT_MESSAGES = 0;

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
        this.logger.info('webhook verified', req.query['hub.challenge']);
        return this.response.success(res, {
          message: 'ok',
          data: req.query['hub.challenge'],
        }, httpStatus.OK);
      } 
      this.logger.error('verification failed. Token mismatch.');
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
        const messageServiceInstance = this.messageService;
        req.body.entry.forEach(async (entry) => {
        // Iterate over each messaging event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        const sender_psid = webhook_event.sender.id;
        SENDER_ID = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        const paramsConst = {
          USER_FIRST_NAME,
          USER_BIRTH_DATE,
          LATEST_MESSAGE,
          PREV_OF_LATEST,
          PREV_OF_PREV,
          WEBHOOK_MESS,
          SENDER_ID,
          COUNT_MESSAGES,
        }
        if (webhook_event.message) {
            COUNT_MESSAGES += 1;

            WEBHOOK_MESS = webhook_event.message.text;
            await messageServiceInstance.handleMessage(sender_psid, webhook_event.message, paramsConst);
        } else if (webhook_event.postback) {
            COUNT_MESSAGES += 1;

            WEBHOOK_MESS = webhook_event.postback.payload;
            await messageServiceInstance.handlePostback(sender_psid, webhook_event.postback, paramsConst);
        }
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
