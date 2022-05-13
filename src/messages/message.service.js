/* eslint-disable no-async-promise-executor */
const MessageModel = require('../models/message.entity.js');
const MongoDBHelper = require('../lib/mongoHelper');
const {
  callSendAPI,
  initialGifts,
  countBirthDays,
  capitalizeFirstLetter
} = require('../lib/helper');

class MessageService {
  constructor(logger, mongoMessage) {
    this.logger = logger;
    this.mongoMessageMessage = new MongoDBHelper(mongoMessage, MessageModel);
  }

  async saveMessage(payload) {
    return this.mongoMessageMessage.save(payload);
  }

  async deleteMessage(param) {
    this.logger.info('PAYLOAD: ', param);
    return this.mongoMessageMessage.deleteOne(param);
  }

  async handleMessage(sender_psid, message) {
    try {
        if (message.quick_reply) {
            handleQuickReply(sender_psid, message);
        } else if (message.attachments) {
                handleAttachmentMessage(sender_psid, message);
        } else if (message.text) {
                handleTextMessage(sender_psid, message);
        } 
        else{
            callSendAPI(sender_psid,`The bot needs more training. You said "${message.text}". Try to say "Hi" or "#start_over" to restart the conversation..`);
        }
    } 
    catch (error) {
        console.error(error);
        callSendAPI(sender_psid,`An error has occured: '${error}'. We have been notified and will fix the issue shortly!`);
    }
  }

  async handleAttachmentMessage(sender_psid, message){
    callSendAPI(sender_psid,`From handle attachment message. You said ${message.text}`);
  }

  async handleTextMessage(sender_psid, message, paramsConst){
    const {
      USER_FIRST_NAME,
      USER_BIRTH_DATE,
      LATEST_MESSAGE,
      PREV_OF_LATEST,
      PREV_OF_PREV,
    } = paramsConst;
    // getting current message
    let mess = message.text;
    mess = mess.toLowerCase();

    PREV_OF_PREV = PREV_OF_LATEST;
    PREV_OF_LATEST = LATEST_MESSAGE;
    LATEST_MESSAGE = mess;

    // message.nlp did not work -> made a workaround
    let greeting = ["hi", "hey", "hello"];
    let accept_conv = ["yup", "yes", "yeah", "sure", "yep", "i do"];
    let deny_conv = ["no", "nah", "nope", "not now", "maybe later"];
    let thanks_conv = ["thanks", "thx", "thank you", "thank you very much", "thanks a lot", "thanks!", "thank you!"];

    let resp;

    // reinitialize conversation
    if(mess === "#start_over"){
        USER_FIRST_NAME = "";
        USER_BIRTH_DATE = "";
        LATEST_MESSAGE = "";
        PREV_OF_LATEST = "";
        PREV_OF_PREV = "";
        
        // uncomment following for clearing messages
        // ARR_MESSAGES = [];
        // COUNT_MESSAGES = 0;
    }

    // greeting case
    if(greeting.includes(mess) || mess === "#start_over"){
        if(USER_FIRST_NAME === ""){
            resp = {
                "text": "(By continuing this conversation you agree to usage of your personal information. Say 'No' if you wish to stop the conversation.) \n\nHello! Would you like to answer few questions?",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Sure",
                    "payload": "sure"
                  },{
                    "content_type":"text",
                    "title":"Not now",
                    "payload": "not now"
                  }
                ]
              }
            callSendAPI(sender_psid,``, resp);
        } else{
            callSendAPI(sender_psid,`The bot needs more training. You said "${message.text}". Try to say "Hi" or "#start_over" to restart the conversation.`);
        }

    }
    // accept case
    else if(accept_conv.includes(mess)){
        if(USER_FIRST_NAME === ""){
            if (countWords(LATEST_MESSAGE) === 1 && !greeting.includes(PREV_OF_PREV)){
                for(var i = 0; i < accept_conv.length; i++){
                    if( mess.includes(accept_conv[i]) )
                      break;
                  }
                  
                if(i !== accept_conv.length) {
                    USER_FIRST_NAME = capitalizeFirstLetter(extractName());
                    console.log(USER_FIRST_NAME);
                   
                    callSendAPI(sender_psid,`We will take your first name as ${USER_FIRST_NAME}. Secondly, we would like to know your birth date. Write it down below in the format YYYY-MM-DD. Example: 1987-03-25`);    
                }
                else{
                    callSendAPI(sender_psid,`First, please write below your first name`);
                }
             }
            else{
                callSendAPI(sender_psid,`First, please write below your first name`);
            }
        }
        else if (USER_BIRTH_DATE === ""){
                if (countWords(LATEST_MESSAGE) === 1 && (extractDate().split("-").length - 1) === 2){
                    USER_BIRTH_DATE = PREV_OF_LATEST;
                    console.log(USER_BIRTH_DATE);
            
                    let resp = {
                        "text": `You agreed that your birth date is ${USER_BIRTH_DATE}. Would you like to know how many days are until your next birtday?`,
                        "quick_replies":[
                        {
                            "content_type":"text",
                            "title": "I do",
                            "payload": "i do"
                        },{
                            "content_type":"text",
                            "title":"Not interested",
                            "payload": "not interested"
                        }
                        ]
                    };
            
                    callSendAPI(sender_psid,``, resp);
                }
            else{
                callSendAPI(sender_psid,`You agreed that your first name is ${USER_FIRST_NAME}. Secondly, we would like to know your birth date. Write it down below in the format YYYY-MM-DD. Example: 1987-03-25`);
            }
         }
         else if (USER_FIRST_NAME !== "" && USER_BIRTH_DATE !== ""){
            let days_left = countBirthDays();

            // bad information introduced
            if(days_left === -1){
                callSendAPI(sender_psid,`Birth date introduced is false. If you wish to start this conversation again write "#start_over". Goodbye 🖐`);
            }
            else{
                // sending 2 carousel products
                let resp = initialGifts();

                callSendAPI(sender_psid,`There are ${days_left} days until your next birthday. Here are some gifts you can buy for yourself 🙂`);
                callSendPromo(sender_psid, resp);
            }
         }
        else {
            callSendAPI(sender_psid,`The bot needs more training. You said "${message.text}". Try to say "Hi" or "#start_over" to restart the conversation.`);
        }
        
    }
    // deny case
    else if (deny_conv.includes(mess)){
        callSendAPI(sender_psid,`Thank you for your answer. If you wish to start this conversation again write "#start_over". Goodbye 🖐`);
    }
    // gratitude case
    else if (thanks_conv.includes(mess)){
        callSendAPI(sender_psid,`You're welcome! If you wish to start this conversation again write "#start_over". Goodbye 🖐`);
    }
    // user may have introduced first name and/or birth date
    else {
        let resp;

        // if we don't know user first name yet
        if(!USER_FIRST_NAME){
            LATEST_MESSAGE = capitalizeFirstLetter(LATEST_MESSAGE);
            resp = {
                "text": "Is " + LATEST_MESSAGE + " your first name?",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title": "Yes",
                    "payload": "yes"
                  },{
                    "content_type":"text",
                    "title":"No",
                    "payload": "no"
                  }
                ]
            };

            callSendAPI(sender_psid,``, resp);

        } // if we don't know user birth date yet
         else if (!USER_BIRTH_DATE){
            resp = {
                "text": "Is " + LATEST_MESSAGE + " your birth date?",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title": "Yep",
                    "payload": "yep"
                  },{
                    "content_type":"text",
                    "title":"Not at all",
                    "payload": "not at all"
                  }
                ]
            };

            callSendAPI(sender_psid,``, resp);
        }
        // something else
        else {
            callSendAPI(sender_psid,`Thank you for your answer. If you wish to start this conversation again write "#start_over". Goodbye 🖐`);
        }
    }
  }

  async handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'looking headphones' || payload === 'looking mi band') {
        // sending 2 similar carouself products
        let resp = {
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                     {
                      "title":"Mpow 059 Headphones for $33.99 + $17.70 Shipping & Import Fees",
                      "image_url":"https://images-na.ssl-images-amazon.com/images/I/617XS3ZQgUL._AC_SL1280_.jpg",
                      "subtitle":"Bluetooth Headphones Over Ear, Hi-Fi Stereo Wireless Headset, Foldable",
                      "default_action": {
                        "type": "web_url",
                        "url": "https://www.amazon.com/dp/B01NAJGGA2/ref=dp_cerb_2",
                        "webview_height_ratio": "tall",
                      },
                      "buttons":[
                        {
                            "type":"web_url",
                            "url":"https://www.amazon.com/s?k=headphones&crid=1TBFG5JJ5SKYQ&sprefix=head%2Caps%2C319&ref=nb_sb_ss_ts-ap-p_1_4",
                            "title":"View more headphones"
                        }            
                      ]      
                    },
                    {
                       "title":"Xiaomi Mi Band 5",
                      "image_url":"https://images-na.ssl-images-amazon.com/images/I/61UZ41QdbCL._AC_SX679_.jpg",
                      "subtitle":"Incredible smartwatch",
                      "default_action": {
                        "type": "web_url",
                        "url": "https://www.amazon.com/Xiaomi-Band-Wristband-Magnetic-Bluetooth/dp/B089NS9JW2/ref=sr_1_3?dchild=1&keywords=mi+band&qid=1599036809&sr=8-3",
                        "webview_height_ratio": "tall",
                      },
                      "buttons":[
                        {
                            "type":"web_url",
                            "url":"https://www.amazon.com/s?k=mi+band&ref=nb_sb_noss_2",
                            "title":"View more like this"
                        }               
                      ]  
                    }
                  ]
                }
            }
        };

        callSendAPI(sender_psid,`Here are 2 similar products based on earlier choice.`);
        callSendPromo(sender_psid, resp);

    } else if (payload === 'not looking headphones' || payload === 'not looking mi band') {  
        callSendAPI(sender_psid,`Thank you for your answer. If you wish to start this conversation again write "#start_over". Goodbye 🖐`);
    }
    else{
        callSendAPI(sender_psid,`The bot needs more training. You said "${message.text}". Try to say "Hi" or "#start_over" to restart the conversation.`);
    }
}
}

module.exports = MessageService;
