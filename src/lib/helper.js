const request = require('request');

function senderAction(recipientId){
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {
            access_token: process.env.ACCESS_TOKEN
        },
        method: "POST",
        json: {
            recipient: {id: recipientId},
            "sender_action":"typing_on"
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}

function sendMessage(recipientId, message){
       return new Promise(function(resolve, reject) {
           request({
               url: "https://graph.facebook.com/v2.6/me/messages",
               qs: {
                   access_token: process.env.ACCESS_TOKEN
               },
               method: "POST",
               json: {
                   recipient: {id: recipientId},
                   message: message,
               }
           }, function(error, response, body) {
               if (error) {
                   console.log("Error sending message: " + response.error);
                   reject(response.error);
               } else {
                   resolve(body);
               }
           });
       })
   }
   
   function sendGenericTemplate(recipientId, respBody) {
       console.log(respBody);
       const nutritionalValue = [];
       for (let i = 0; i < respBody.length; i++) { // I dont like using forEach
           let obj = {
               "title":respBody[i].food_name,
               "image_url": respBody[i].thumbnail,
               "subtitle": 'Total Calories: ' + respBody[i].total_calories + "\n" + 
                           'protein: ' + respBody[i].protein + "\n" + 
                           'Carbohydrates: ' + respBody[i].total_carbohydrate,
           }
           nutritionalValue.push(obj);
       }
       let messageData = {
           "attachment": {
               "type": "template",
               "payload": {
                   "template_type": "generic",
                   "elements": nutritionalValue
               }
           }
       }
       request({
           url: 'https://graph.facebook.com/v2.6/me/messages',
               qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
               method: 'POST',
               json: {
                   recipient: {id: recipientId},
                   message: messageData,
               }
       }, function(error, response, body){
           if (error) {
               console.log("Error sending message: " + response.error)
           }
       })
   }

   module.exports = {
          senderAction,
          sendMessage,
          sendGenericTemplate,
   }