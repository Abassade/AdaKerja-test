const request = require('request');

const { senderAction, sendMessage, sendGenericTemplate } = require('../lib/helper');

module.exports = function processMessage(event) {
    if (!event.message.is_echo) {
        const message = event.message;
        const senderID = event.sender.id;
        logger.info("Received message from senderId: " + senderID);
        logger.info("Message is: " + JSON.stringify(message));
        if (message.text) {
            // now we will take the text received & senderId and push to a queue
            const { text } = message;

        }
    }
}