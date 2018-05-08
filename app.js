const _ = require('lodash');
const Botkit = require('botkit');
const NodeCache = require('node-cache');
const holidays = require('./coreMike/helpers/getHolidays.js');
const constants = require('./coreMike/slackConstants');
require('dotenv').config({ silent: true });
require('./coreMike/resources/insultStore');

const appCache = new NodeCache();

const baseResponses = require('./coreMike/responses/baseResponses');
const scheduledResponses = require('./coreMike/responses/scheduledResponses');

let debugMode = false;

// Keep bot from starting if a Slack token is missing
if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

if (!process.env.FIREBASEURI) {
  console.log('Error: Specify FIREBASEURI in environment');
  process.exit(1);
}

if (!process.env.NODE_ENV) {
  console.warn('Warning: Specify an environment mode');
} else {
  const development = process.env.NODE_ENV !== 'production';

  if (development) {
    debugMode = true;
  }
}

const firebaseStorage = require('botkit-storage-firebase')({ firebase_uri: process.env.FIREBASEURI });

const controller = Botkit.slackbot({
  debug: debugMode,
  retry: 5,
  storage: firebaseStorage,
});

const bot = controller.spawn({
  token: process.env.token,
}).startRTM();

/*
* Manually Set storage for bot user
 var user = {
 id: constants.getBotUserID(),
 curses: "f***",
 helpText: "help"
 };

 controller.storage.users.save(user, function(err, id) {
 console.log("saved bot user data");
 });
 */

controller.storage.users.get(constants.getBotUserID(), (err, userObj) => {
  if (userObj && userObj.curses) {
    const profaneList = _.words(userObj.curses);
    const obj = { profaneList };
    appCache.set('profane', obj, (cacheErr, success) => {
      if (!cacheErr && success) {
        console.log('loaded profanity list');
      }
    });
  } else {
    console.error('no curse data was found');
  }
});

holidays.getHolidaysForYear((holidayData) => {
  if (holidayData) {
    appCache.set('holidays', holidayData, (err, success) => {
      if (!err && success) {
        console.log('loaded holidays list');
        console.log(holidayData);
      }
    });
  }
});

baseResponses(controller, appCache);

// start scheduled mike messages
scheduledResponses(controller, appCache, bot);


module.exports = bot;
