/*
 *   defines all the basic mike responses
 */
var os = require('os'),
    dayOfTheWeekResponses = require('./dayOfTheWeek'),
    messageUtils = require('../helpers/messageUtils'),
    vocabulary = require('../helpers/vocabulary'),
    love = require('../responses/loveMachine'),
    weather = require('../responses/weatherResponses'),
    conversations = require('../responses/conversations'),
    patterns = require('../helpers/regexPatterns'),
    cleverbot = require('../helpers/cleverbot');


var baseResponses = function(controller, callback) {

    // when joins a channel
    controller.on('bot_channel_join', function (bot, message) {
        bot.reply(message, "Mike is here! :fist::skin-tone-5:")
    });

    controller.on("user_channel_join", function(bot, message) {
        messageUtils.postReaction(bot, message, 'fist');
        var intro = "Welcome <@"+message.user+">! May I be the first to welcome you to the <#" +message.channel+"> channel.";
        bot.reply(message, intro);
    });

    // ambient responses [use sparingly]
    controller.hears(['mornin mornin', 'good morning', 'morning', 'mornin'], ["ambient"], function(bot, message) {
            bot.startTyping(message);
            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, user.name + ' ' + vocabulary.getMikeMorninTimeSensitive(null) + love.getLoveReactionForName(user.name))
                } else {
                    bot.reply(message, vocabulary.getMikeMorninTimeSensitive(message.user) + love.getLoveReactionForName(message.user));
                }
            });
    });

    controller.hears(["doorman-mike"], ["ambient"], function(bot, message) {
        messageUtils.postReaction(bot, message, 'fist');
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

            weather.getWeatherResponse(message.user, function(msg) {
                bot.reply(message, msg);
            });

        }
        // message asks what day is it?
        else if ( usersMessage.search(patterns.getWhatDayRegex()) !== -1) {

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, dayOfTheWeekResponses.questionResponse(user.name, bot, message));
                } else {
                    bot.reply(message, dayOfTheWeekResponses.questionResponse(null, bot, message));
                }
            });

        }// message asks what time is it?
        else if ( usersMessage.search(patterns.getTimeRegex()) !== -1) {
            messageUtils.postReaction(bot, message, 'timer_clock');

            var msg = "it's time to get a " + vocabulary.getMikeDang() + " watch!";
            var loveMsg = love.getLoveReactionForName(message.user);
            if (loveMsg) {
                msg += loveMsg;
            }
            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, user.name + ' ' + msg);
                } else {
                    bot.reply(message, "<@" + message.user + "> " + msg);
                }
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

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {

                    bot.reply(message, user.name + ' ' + lunchSuggestion + love.getLoveReactionForName(user.name))
                } else {
                    bot.reply(message, "<@" + message.user + "> " + lunchSuggestion + love.getLoveReactionForName(message.user));
                }
            });

        } else if (usersMessage.indexOf('send mornin to') > -1) {
            conversations.sendMorninToHandler(bot, message);

        } else if ( usersMessage.search(patterns.getWhatsMyNameRegex()) !== -1) {

            conversations.setNameHandler(controller, bot, message);

        } else if ( usersMessage.indexOf("mornin mornin") > -1 | usersMessage.indexOf("good mornin") > -1  | usersMessage.indexOf("morning") > -1) {

            bot.reply(message, vocabulary.getMikeMorninTimeSensitive(message.user));

        } else if ( usersMessage.indexOf("uptime") > -1 | usersMessage.indexOf("identify yourself") > -1  | usersMessage.indexOf("who are you") > -1 | usersMessage.indexOf("what is your name") > -1) {

            messageUtils.postReaction(bot, message, 'fist');

            var hostname = os.hostname();
            var uptime = formatUptime(process.uptime());

            bot.reply(message,
                ':doorman: I am a bot named <@' + bot.identity.name +
                '>. I have been alive for ' + uptime + ' on NONE OF YO GODANG BUSINESS SERVER. (' + hostname + ')');

        } else if ( usersMessage.toLowerCase() == "hey" | usersMessage.indexOf("sup?") > -1  | usersMessage.indexOf("hows it going") > -1 | usersMessage.toLowerCase() == "whats good" | usersMessage.toLowerCase() == "whats up") {

            var msgPt2 = dayOfTheWeekResponses.statementResponse();

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    var personalHello = vocabulary.getPersonalMikeHello(user.name).toUpperCase();
                    bot.reply(message, personalHello + ' ' + msgPt2);
                } else {
                    var personalMikeHello = vocabulary.getPersonalMikeHello("<@" + message.user + "> ").toUpperCase();
                    bot.reply(message, personalMikeHello + ' ' + msgPt2);
                }
            });

        } else if ( usersMessage.toLowerCase() == 'hi' | usersMessage.toLowerCase() == 'hello') {

            messageUtils.postReaction(bot, message, 'fist');

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, vocabulary.getPersonalMikeHello(user.name));
                } else {
                    bot.reply(message, vocabulary.getPersonalMikeHello("<@" + message.user + "> "));
                }
            });

        } else if ( usersMessage.match(patterns.getBraptRegex())) {

            messageUtils.postReaction(bot, message, 'poop');

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, user.name + " u stink dude");
                } else {
                    bot.reply(message, "<@" + message.user + "> u stink dude.");
                }
            });

        } else if ( usersMessage.toLowerCase() == 'mike' | usersMessage.toLowerCase() == 'doorman') {

            messageUtils.postReaction(bot, message, 'fist');

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, "Yes, " + user.name + " that's my name.");
                } else {
                    bot.reply(message, "Yes, that's my name.");
                }
            });

        }
        else {
            // else ask clever bot for a response (cleverbot.io)
            cleverbot.getCleverBotResponse(message, function(response) {
               bot.reply(message, response);
            });
        }

    });


};

function formatUptime(uptime) {

    // if uptime is greater than one day
    if (uptime > 86400) {
        var days    = Math.floor(uptime / 86400);
        var hours   = Math.floor((uptime - (days * 86400)) / 3600);
        var minutes = Math.floor((uptime - ((hours * 3600)+(days * 86400))) / 60);
        var seconds = uptime - (days * 86400) - (hours * 3600) - (minutes * 60);

        if (days   < 10) {days   = "0"+days;}
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        return days + ' days : ' + hours + ' hrs : ' + minutes + ' minutes : ' + Math.round(seconds) + ' seconds';

    } else {
        // else uptime is less than a day
        var hours   = Math.floor(uptime / 3600);
        var minutes = Math.floor((uptime - (hours * 3600)) / 60);
        var seconds = uptime - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours + ' hrs : ' + minutes + ' minutes : ' + Math.round(seconds) + ' seconds';
    }
}

module.exports = baseResponses;