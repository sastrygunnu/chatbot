'use strict'
const http = require('http')
const https = require('https')
const Bot = require('messenger-bot')
const to_json = require('xmljson').to_json;
const Wit = require('node-wit').Wit;
const translate = require('google-translate-api');
const request = require('request')

let bot = new Bot({
  token: 'EAABrSIFfvH0BAFrhXS3oa7Krh7Tu7Bdjcuraiz5xjSaSEaS2SjQaikTXwZBRy9r1T848QHPbRZCxMDGLZCmKJwIYD3IAUcRF7lwf9AMAL0TXZANZBBqITAwANwotsCrLivTUvHfy5LSLmyCdKa9Epocgo0zA8Hq1s25IZApRTwXwZDZD',
  verify: 'VERIFY_TOKEN'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {

  //translate the language and detect language
  translate(payload.message.text, { to: 'en' }).then(res => {
    //console.log(res.text);
    //console.log(res.from.language.iso);
    processInputText(payload.sender.id, res.text, res.from.language.iso);
  }).catch(err => {
    console.error(err);
  });

})

http.createServer(bot.middleware()).listen(3000)


function processInputText(senderId, text, language) {
  var resp = ''
  if (language !== 'en' && language !== 'ar')
    return bot.sendMessage(senderId, { "text": "I’m sorry, I don’t understand. Could you please use English/Arabic?" })
  const witClient = new Wit({ accessToken: '2NNA7PXEVHIVJBJKP2GBADHXWOXWBUNL' });
  witClient.message(text, {})
    .then((data) => {
      processWitOutput(data, senderId, language)
    })
    .catch(console.error);
}

function processWitOutput(data, senderId, language) {
  if (isEmptyObject(data.entities)) {
    //if entities not defined then inform the admin to add a new entry in wit if it is a valid text
    console.log("Error: Entities not defined")
    return
  }
  //console.log('Wit.ai response: ' + JSON.stringify(data))
  if (!(typeof data.entities.greetings === "undefined") && !isEmptyObject(data.entities.greetings)) {
    //TO DO:replace with facebook welcome screen & greetings
    sendTextMessage("Hi Good Day :) How can i help you?", senderId, language);

  }
  else if (!(typeof data.entities.intent === "undefined") && !isEmptyObject(data.entities.intent)) {
    //sendTextMessage(data._text, senderId, language);
    processWitIntent(data.entities.intent, senderId, language)
  }

}

function processWitIntent(intent, senderId, language) {
  switch (intent[0].value) {
    case "get_flight_status":
      console.log("intent: get_flight_status")
      break;
    default:
      break;
  }
}
function sendTextMessage(text, senderId, language) {
  if (language === 'ar') {
    translate(text, { to: 'ar' }).then(res => {
      bot.sendMessage(senderId, { "text": res.text })
    }).catch(err => {
      console.error(err);
    });
  }
  else {
    bot.sendMessage(senderId, { "text": text })
  }

}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function loginToMF() {
  request({
    method: 'POST',
    uri: `https://100009629.auth.konycloud.com/login`,
    headers: [
      {
        name: 'X-Kony-App-Key',
        value: '4dd7d8daf32a5ecd00871071e9e5b57e'
      },
      {
        name: 'X-Kony-App-Secret',
        value: '5641e81aec8223be3cf7563ca36a640c'
      }

    ],
    body: {
      password: "Kony@1234",
      userid: "sajeesh.naniyil@kony.com"
    },
    json: true
  }, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    invokeService(body.claims_token.value)
  });
}
function invokeService(calimsToken) {
  request({
    method: 'POST',
    uri: `https://saudiairlines-dev2.konycloud.com/services/FlightInfo/getFlightInfo`,
    headers: [
      {
        name: 'token_auth',
        value: calimsToken
      }
    ],
    body: {
      storeFrontId: "JEDSV08AD",
      dateOffSet: "0",
      flightNumber: "SV123"
    },
    json: true
  }, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
}
