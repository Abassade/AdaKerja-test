const request = require('request');

function countBirthDays(birthDate=USER_BIRTH_DATE){
    var today = new Date();

    // we extract user birth date information in decimal
    var user_year = parseInt(birthDate.substring(0, 4), 10);
    var user_month = parseInt(birthDate.substring(5, 7), 10);
    var user_day = parseInt(birthDate.substring(8, 10), 10);

    // bad information introduced
    if(user_year >= today.getFullYear() || user_month > 12 || user_day > 31){
        return -1;
    }
    else{ // valid information -> proceed to calculus
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let days_left = Math.round(Math.abs( ( (today - new Date(today.getFullYear(), user_month - 1, user_day)) / oneDay) ) );

        return days_left;
    }
}

function initialGifts(){
    let resp = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"COWIN E7s Headphones for $59.99 + $25.23 Shipping & Import Fees",
                  "image_url":"https://m.media-amazon.com/images/I/41WzHq0SkRL._AC_UY218_.jpg",
                  "subtitle":"Active Noise Cancelling Headphones, with Bluetooth and Microphone",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.amazon.com/Cancelling-Headphones-Bluetooth-Microphone-Comfortable/dp/B019U00D7K/ref=sr_1_1?dchild=1&keywords=headphones&qid=1599034241&s=specialty-aps&sr=1-1",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                        "type":"postback",
                        "title":"See similar product",
                        "payload":"looking headphones"
                    },{
                      "type":"postback",
                      "title":"Not what I was looking for",
                      "payload":"not looking headphones"
                    }              
                  ]      
                },
                {
                   "title":"Xiaomi Mi Band 4",
                  "image_url":"https://images-na.ssl-images-amazon.com/images/I/51SQSEoSr8L._AC_SL1000_.jpg",
                  "subtitle":"Incredible smartwatch",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.amazon.com/Xiaomi-Mi-Band-4/dp/B07T4ZH692/ref=sr_1_3?dchild=1&keywords=mi+band+4&qid=1599037215&sr=8-3",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                        "type":"postback",
                        "title":"See similar product",
                        "payload":"looking mi band"
                    },{
                      "type":"postback",
                      "title":"Not what I was looking for",
                      "payload":"not looking mi band"
                    }              
                  ]  
                }
              ]
            }
        }
    };

    return resp;
}

function callSendAPI(sender_psid, response, quick_reply={"text": ""}) {
    // Construct the message body
    let request_body;

    if(!quick_reply.text){
        request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": { "text": response }
        };
    }
    else{
        request_body = {
            "recipient": {
                "id": sender_psid
            },
            "messaging_type": "RESPONSE",
            "message": quick_reply
        };
    }
    

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v13.0/me/messages",
        "qs": { "access_token": process.env.FACEBOOK_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

   module.exports = {
    callSendAPI,
    initialGifts,
    countBirthDays,
    capitalizeFirstLetter,
   }