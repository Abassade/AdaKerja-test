/* eslint-disable no-async-promise-executor */
const MessageModel = require('../models/message.entity.js');
const MongoDBHelper = require('../lib/mongoHelper');

class MessageService {
  constructor(logger, mongoMessage) {
    this.logger = logger;
    this.mongoMessageMessage = new MongoDBHelper(mongoMessage, MessageModel);
  }

  async saveMessage(payload) {
    return this.mongoMessageMessage.save(payload);
  }

  async isMessage(param) {
    this.logger.info('PAYLOAD: ', param);
    return this.mongoMessageMessage.get(param);
  }

  async getCategories(param) {
    this.logger.info('PAYLOAD: ', param);
    return this.mongoMessageMessage.getBulk(param);
  }

  async updateMessage(param, data) {
    this.logger.info('PAYLOAD: ', param);
    return this.mongoMessageMessage.update(param, data);
  }

  async deleteMessage(param) {
    this.logger.info('PAYLOAD: ', param);
    return this.mongoMessageMessage.deleteOne(param);
  }
}

module.exports = MessageService;
