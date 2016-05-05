var path = require('path');
require('dotenv').config();

var Botkit = require('botkit');

var baseResponses = require('./coreMike/responses/baseResponses');
var scheduledResponses = require('./coreMike/responses/scheduledResponses');

var debugMode = false;

// Keep bot from starting if a Slack token is missing
if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}
if (!process.env.NODE_ENV) {
  console.warn('Warning: Specify an environment mode');
} else {
  var development = process.env.NODE_ENV !== 'production';

  if (development) {
    debugMode = true;
  }
}

var firebaseStorage = require('botkit-storage-firebase')({firebase_uri: process.env.FIREBASEURI});

var controller = Botkit.slackbot({
  debug: debugMode,
  storage: firebaseStorage
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

baseResponses(controller, null);

// start scheduled mike messages
scheduledResponses(bot);



module.exports = bot;
