var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');
var dayOfTheWeekResponses = require('../responses/dayOfTheWeek');
var patterns = require('../helpers/regexPatterns');
var love = require('../responses/loveMachine');
var S = require('string');
var characterLimit = 50;

module.exports = {

    callMeHandler: function callMeHandler(controller, bot, message) {
        var name = S(message.text.match(patterns.getMyNameRegex())[1]).replaceAll(":", "").s;
        var length = name.length;
        var tooLong = false;

        if (length > characterLimit) {
            name = S(name).left(characterLimit).s;
            tooLong = true;
        }
        if (name.search(patterns.getInvalidNameRegex()) !== -1) {
            bot.reply(message, 'woah bro I cannot call you that.');
        } else {
            controller.storage.users.get(message.user, function(err, user) {
                if (!user) {
                    user = {
                        id: message.user,
                    };
                }
                user.name = name;
                controller.storage.users.save(user, function(err, id) {
                    var loveMsg = love.getLoveReactionForName(user.name);
                    if (loveMsg) {
                        loveMsg = " I kind of like that name." + loveMsg;
                    }
                    if (tooLong) {
                        bot.reply(message, 'woah bro that\'s a long ass name.. im gonna cut yah off and call yah `' + name + '`' );
                    } else {
                        bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.' + loveMsg);
                    }
                });
            });
        }


    },
    setNameHandler: function setNameHandler(controller, bot, message) {

        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Your name is ' + user.name + ' ' + love.getLoveReactionForName(user.name));
            } else {
                bot.startConversation(message, function(err, convo) {
                    if (!err) {
                        convo.say('I do not know your name yet!');

                        convo.ask('What should I call you?', function(response, convo) {
                            var name = S(response.text).replaceAll(":", "").s;
                            convo.ask('You want me to call you `' + name + '`?', [
                                {
                                    pattern: 'yes',
                                    callback: function(response, convo) {
                                        // since no further messages are queued after this,
                                        // the conversation will end naturally with status == 'completed'
                                        convo.next();
                                    }
                                },
                                {
                                    pattern: 'no',
                                    callback: function(response, convo) {
                                        // stop the conversation. this will cause it to end with status == 'stopped'
                                        convo.stop();
                                    }
                                },
                                {
                                    default: true,
                                    callback: function(response, convo) {
                                        convo.repeat();
                                        convo.next();
                                    }
                                }
                            ]);

                            convo.next();

                        }, {'key': 'nickname'}); // store the results in a field called nickname

                        convo.on('end', function(convo) {
                            if (convo.status == 'completed') {
                                bot.reply(message, 'OK! I will update my god dang notes...');

                                var tooLong = false;


                                controller.storage.users.get(message.user, function(err, user) {
                                    if (!user) {
                                        user = {
                                            id: message.user,
                                        };
                                    }


                                    user.name = S(convo.extractResponse('nickname')).replaceAll(":", "").s;
                                    var length = user.name.length;

                                    if (length > characterLimit) {
                                        user.name = S(user.name).left(characterLimit).s;
                                        tooLong = true;
                                    }

                                    if (user.name.search(patterns.getInvalidNameRegex()) !== -1) {
                                        bot.reply(message, 'woah bro I cannot call you that.');
                                    } else {
                                        controller.storage.users.save(user, function(err, id) {
                                            var loveMsg = love.getLoveReactionForName(user.name);
                                            if (loveMsg) {
                                                loveMsg = " I kind of like that name." + loveMsg;
                                            }
                                            if (tooLong) {
                                                bot.reply(message, 'woah bro that\'s a long ass name.. im gonna cut yah off and call yah `' + name + '`' );
                                            } else {
                                                bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.' + loveMsg);
                                            }


                                        });
                                    }

                                });



                            } else {
                                // this happens if the conversation ended prematurely for some reason
                                bot.reply(message, 'OK, nevermind!');
                            }
                        });
                    }
                });
            }
        });


    },

    sendMorninToHandler: function sendMorninToHandler(bot, message) {

        var placeholder = message.text.split("send mornin to ")[1],
            placeholder = placeholder ? placeholder.split(" in ") : false;

        var user = placeholder[0];
        var channel = placeholder[1],
            channel = channel ? channel.split("#")[1] : false;
        channel = channel ? channel.split(">")[0] : false;

        bot.startConversation(message,function(err,convo) {

            if ( !user | !channel ) {

                bot.reply(message, "Sorry I didn't get that. If you want me to send a mornin' mornin' to someone, say `@doorman-mike send mornin to @username in #channel`");
                convo.stop();

            } else {

                convo.ask("No problem! Do make sure I've been invited to that channel first though. \n Should I tell "+user+" you requested this? Say `yes` or `no`",function(response,convo) {

                    if ( response.text === 'yes' | response.text === 'Yes' ) {

                        bot.reply(message, "Will do! Check <#"+channel+">");
                        var morninMessage = dayOfTheWeekResponses.getMikeMorninTimeSensitive(null);

                        messageUtils.postMessage(bot, channel, "Yo "+user + ", <@"+message.user+"> wants me to tell yah, " + morninMessage);

                    } else {
                        var msg = dayOfTheWeekResponses.getMikeMorninTimeSensitive(null);

                        bot.reply(message, "Sneaky! Check <#"+channel+">");

                        messageUtils.postMessage(bot, channel, user + ' ' + msg);

                    }

                    convo.stop();

                });
            }
        })

    }

}