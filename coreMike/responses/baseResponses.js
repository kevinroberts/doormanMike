/*
 *   defines all the basic mike responses
 */

var cleverbotio = require("cleverbot.io"),
    cleverbotio = new cleverbotio(process.env.CLEVERBOTUSER, process.env.CLEVERBOTAPI);
cleverbotio.setNick("Mike");
cleverbotio.create(function (err, session) {
    if (err) {
        console.log('Cleverbot create fail', err);
    } else {
        console.log('cleverbot create success.');
    }
});


var os = require('os'),
    dayOfTheWeekResponses = require('./dayOfTheWeek'),
    messageUtils = require('../helpers/messageUtils'),
    vocabulary = require('../helpers/vocabulary'),
    love = require('../responses/loveMachine'),
    weather = require('../responses/weatherResponses'),
    conversations = require('../responses/conversations'),
    patterns = require('../helpers/regexPatterns'),
    Cleverbot = require('../helpers/cleverbot');
const matcher = require('matcher');
var Chance = require('chance'),
    chance = new Chance();


var baseResponses = function(controller, callback) {

    // when joins a channel
    controller.on('bot_channel_join', function (bot, message) {
        bot.reply(message, "Mike is here! :fist::skin-tone-5:")
    });

    controller.on("user_channel_join", function(bot, message) {
        messageUtils.postMikeFist(bot, message);
        var intro = "Welcome <@"+message.user+">! May I be the first to welcome you to the <#" +message.channel+"> channel.";
        bot.reply(message, intro);
    });

    // ambient responses [use sparingly]
    controller.hears(['mornin mornin', 'good morning', 'morning'], ["ambient"], function(bot, message) {
        if (chance.bool({likelihood: 30})) {
            bot.startTyping(message);
            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                bot.reply(message, name + ' ' + dayOfTheWeekResponses.getMikeMorninTimeSensitive(null) + love.getLoveReactionForName(name));
            });
        }

    });

    controller.hears(["doorman-mike"], ["ambient"], function(bot, message) {
        messageUtils.postMikeFist(bot, message);
        var intro = "<@"+message.user+"> what's up?";
        bot.reply(message, intro);
    });


    /*
     *    Catch all other responses that are not defined and pass it through our mike logic
     */
    controller.hears('', 'direct_message,direct_mention,mention', function (bot, message) {
        // start mike typing - some responses take longer than others
        bot.startTyping(message);

        // checking the message.event: message.event == 'direct_message'
        var usersMessage = message.text;

        // respond to weather related queries
        if (usersMessage.search(patterns.getWeatherRegex()) !== -1) {

            weather.getWeatherResponse(controller, message.user, function(msg) {
                bot.reply(message, msg);
            });

        }
        // message asks what day is it?
        else if ( usersMessage.search(patterns.getWhatDayRegex()) !== -1) {

            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                bot.reply(message, dayOfTheWeekResponses.questionResponse(name, bot, message));
            });

        }// message asks what time is it?
        else if ( usersMessage.search(patterns.getTimeRegex()) !== -1) {
            messageUtils.postReaction(bot, message, 'timer_clock');

            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                var msg = "it's time to get a " + vocabulary.getMikeDang() + " watch!";
                var loveMsg = love.getLoveReactionForName(name);
                bot.reply(message, name + ' ' + msg + loveMsg);
            });

        } else if ( usersMessage.search(patterns.getTacoRegex()) !== -1) {
            messageUtils.postMikeFist(bot, message);
            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                var msg = "thanks for the " + vocabulary.getMikeDang() + " taco bro!";
                bot.reply(message, name + ' ' + msg);
            });

        } else if ( usersMessage.search(patterns.getMyNameRegex()) !== -1) {
            conversations.callMeHandler(controller, bot, message);
        } else if ( usersMessage.search(patterns.getWhoKilledRegex()) !== -1) {
            messageUtils.postReaction(bot, message, 'knife');

            bot.reply(message, 'I did! And it\'s NONE OF YOUR ' + vocabulary.getMikeDang().toUpperCase() + ' BUSINESS ');

        } else if ( usersMessage.search(patterns.getKidsRegex()) !== -1) {
            messageUtils.postReaction(bot, message, 'scream');

            bot.reply(message, 'I don\'t run a ' + vocabulary.getMikeDang() + ' day care here keep dem kids away!');

        } else if ( usersMessage.search(patterns.getWhereToEatRegex()) !== -1) {

            messageUtils.postReaction(bot, message, 'fork_and_knife');
            var lunchSuggestion = vocabulary.getLunchMike();
            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                var loveMessage = love.getLoveReactionForName(name);
                bot.reply(message, name + ' ' + lunchSuggestion + loveMessage);
            });

        } else if (matcher.isMatch(usersMessage, 'send mornin to*')) {
            conversations.sendMorninToHandler(bot, message);

        } else if (matcher.isMatch(usersMessage, 'my birthday is*')) {
            conversations.setMyBirthdayHandler(controller, bot, message);

        } else if (matcher.isMatch(usersMessage, 'when is my birthday*')) {
            conversations.getMyBirthdayHandler(controller, bot, message);

        } else if ( usersMessage.search(patterns.getWhatsMyNameRegex()) !== -1) {

            conversations.setNameHandler(controller, bot, message);

        } else if ( matcher.isMatch(usersMessage, 'mornin* mornin*') | matcher.isMatch(usersMessage, 'good mornin*') | matcher.isMatch(usersMessage, 'mornin*')) {
            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                bot.reply(message, dayOfTheWeekResponses.getMikeMorninTimeSensitive(name));
            });

        } else if ( usersMessage.indexOf("uptime") > -1 | usersMessage.indexOf("identify yourself") > -1  | usersMessage.indexOf("who are you") > -1 | usersMessage.indexOf("what is your name") > -1) {

            messageUtils.postMikeFist(bot, message);

            var hostname = os.hostname();
            var uptime = messageUtils.formatUptime(process.uptime());

            bot.reply(message,
                ':doorman: I am a bot named <@' + bot.identity.name +
                '>. I have been alive for ' + uptime + ' on NONE OF YO GODANG BUSINESS SERVER. (' + hostname + ')');

        } else if ( usersMessage.toLowerCase() == "hey" | usersMessage.indexOf("sup?") > -1  | usersMessage.indexOf("hows it going") > -1 | usersMessage.toLowerCase() == "whats good" | usersMessage.toLowerCase() == "whats up") {

            var msgPt2 = dayOfTheWeekResponses.statementResponse();

            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                var personalHello = vocabulary.getPersonalMikeHello(name).toUpperCase();
                bot.reply(message, personalHello + ' ' + msgPt2);
            });

        } else if ( usersMessage.toLowerCase() == 'hi' | usersMessage.toLowerCase() == 'hello') {

            messageUtils.postMikeFist(bot, message);

            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                bot.reply(message, vocabulary.getPersonalMikeHello(name));
            });

        } else if ( usersMessage.match(patterns.getBraptRegex())) {

            messageUtils.postReaction(bot, message, 'poop');

            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                bot.reply(message, vocabulary.getBrapt(name));
            });

        } else if ( usersMessage.toLowerCase() == 'mike' | usersMessage.toLowerCase() == 'doorman') {

            messageUtils.postMikeFist(bot, message);

            messageUtils.getUsernameFromController(controller, message.user, function(name) {
                bot.reply(message, "Yes, " + name + " that's my name.");
            });

        }
        else {
            var cleverbotInstance = new Cleverbot(cleverbotio);
            // else ask clever bot for a response (cleverbot.io)
            cleverbotInstance.getCleverBotResponse(message, function(response) {
               bot.reply(message, response);
            });
        }

    });


};


module.exports = baseResponses;