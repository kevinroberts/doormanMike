var path = require('path');
var _ = require('lodash');
var Botkit = require('botkit');
require('dotenv').config({silent: true});
var NodeCache = require( "node-cache" );
var constants = require('./coreMike/slackConstants');

var appCache = new NodeCache();

var baseResponses = require('./coreMike/responses/baseResponses');
var scheduledResponses = require('./coreMike/responses/scheduledResponses');

var debugMode = false;

// Keep bot from starting if a Slack token is missing
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

if (!process.env.FIREBASEURI) {
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

controller.storage.users.get(constants.getBotUserID(), function (err, userObj) {
    if (userObj && userObj.curses) {
        var profaneList = _.words(userObj.curses);
        var obj = { profaneList: profaneList};
        appCache.set( "profane", obj, function( err, success ) {
            if (!err && success) {
                console.log("loaded profanity list");
            }
        });

    } else {
        console.error("no curse data was found");
    }
});

baseResponses(controller, appCache);

// start scheduled mike messages
scheduledResponses(controller, bot);


module.exports = bot;
