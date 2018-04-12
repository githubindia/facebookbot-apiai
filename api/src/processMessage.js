const request = require('request');
var deasync=require('deasync');
var schema = require('./schema.json');
var natural = require('natural');
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;
const API_AI_TOKEN = process.env.AI_TOKEN; // silly-name-maker agent.
const apiAiClient = require('apiai')(API_AI_TOKEN);
var servicenow = require('./servicenow.js');
var async = require('async');

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    var apiaiSession = apiAiClient.textRequest(message, {sessionId: 'cool'});
    //console.log(JSON.stringify(apiaiSession));
    apiaiSession.on('response', (response) => {
        console.log(JSON.stringify(response));
        const result = response.result.fulfillment.speech;
        console.log(result);
        if (result == "") {
            console.log("result is empty");
            var color = response.result.parameters.color;
            var number = response.result.parameters.number;
            sendResult = "Your silly name is " + color + number;
            sendTextMessage(senderId, sendResult);
        } else {
            sendTextMessage(senderId, result)
        }


        
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
