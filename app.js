var path = require('path');

var Botkit = require('botkit');

var baseResponses = require('./coreMike/responses/baseResponses');
var scheduledResponses = require('./coreMike/responses/scheduledResponses');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}


var controller = Botkit.slackbot({
  debug: true,
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

baseResponses(controller, null);

// start scheduled mike messages
scheduledResponses(bot);



module.exports = bot;
