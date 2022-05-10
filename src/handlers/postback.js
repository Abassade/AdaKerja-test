const request = require('request');
const { conversations } = require('../config/configuration')
const { senderAction, sendMessage } = require('../lib/helper');


 module.exports = function processPostback(event) {
     const senderID = event.sender.id;
     const payload = event.postback.payload;

     if (payload) {
        
     }
 }