/*
 *   defines all the basic mike responses
 */
var os = require('os');
var dayOfTheWeekResponses = require('./dayOfTheWeek');
var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');

var baseResponses = function(controller, callback) {

    controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

        messageUtils.postReaction(bot, message, 'fist');

        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Hello ' + user.name + '!!');
            } else {
                bot.reply(message, 'Hello.');
            }
        });
    });

    controller.on('bot_channel_join', function (bot, message) {
        bot.reply(message, ":fist::skin-tone-5:")
    });

    controller.hears('.*', ['mention'], function (bot, message) {
        bot.reply(message, 'you\'re ' + vocabulary.getMikeDang() + ' right')
    });

    controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
        var name = message.match[1];
        controller.storage.users.get(message.user, function(err, user) {
            if (!user) {
                user = {
                    id: message.user,
                };
            }
            user.name = name;
            controller.storage.users.save(user, function(err, id) {
                bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
            });
        });
    });

    controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Your name is ' + user.name);
            } else {
                bot.startConversation(message, function(err, convo) {
                    if (!err) {
                        convo.say('I do not know your name yet!');
                        convo.ask('What should I call you?', function(response, convo) {
                            convo.ask('You want me to call you `' + response.text + '`?', [
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

                                controller.storage.users.get(message.user, function(err, user) {
                                    if (!user) {
                                        user = {
                                            id: message.user,
                                        };
                                    }
                                    user.name = convo.extractResponse('nickname');
                                    controller.storage.users.save(user, function(err, id) {
                                        bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                    });
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
    });

    controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
        'direct_message,direct_mention,mention', function(bot, message) {

            var hostname = os.hostname();
            var uptime = formatUptime(process.uptime());

            bot.reply(message,
                ':doorman: I am a bot named <@' + bot.identity.name +
                '>. I have been alive for ' + uptime + ' on NONE OF YO GODANG BUSINESS SERVER. (' + hostname + ')');

        });

    controller.hears(['hey', 'sup', 'whats up', 'whats good'],
        'direct_message,direct_mention,mention', function(bot, message) {

            var msg = dayOfTheWeekResponses.statementResponse();

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, 'WHAT\'S UP ' + user.name + '!!! ' + msg);
                } else {
                    bot.reply(message, 'WHAT\'S UP!!! ' + msg );
                }
            });
        });


    controller.hears(["what time is it"], ["direct_message","direct_mention","mention","ambient"], function(bot, message) {

        messageUtils.postReaction(bot, message, 'timer_clock');

        var msg = "it's time to get a " + vocabulary.getMikeDang() + " watch!";
        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, user.name + ' ' + msg);
            } else {
                bot.reply(message, msg);
            }
        });

    });


    controller.hears(['what day is it'],
        'direct_message,direct_mention,mention', function(bot, message) {

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, dayOfTheWeekResponses.questionResponse(user.name, bot, message));
                } else {
                    bot.reply(message, dayOfTheWeekResponses.questionResponse(null, bot, message));
                }
            });
        });

    controller.hears(['mornin mornin', 'good morning', 'morning', 'mornin'],
        ["direct_message","direct_mention","mention","ambient"], function(bot, message) {

            bot.reply(message, "<@"+message.user+"> " + vocabulary.getMikeMornin() + "\n" + dayOfTheWeekResponses.statementResponse());

        });

    controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('Are you sure you want me to ' + vocabulary.getMikeDang() + ' shutdown?', [
                {
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.say('Bye!');
                        convo.next();
                        setTimeout(function() {
                            process.exit();
                        }, 3000);
                    }
                },
                {
                    pattern: bot.utterances.no,
                    default: true,
                    callback: function(response, convo) {
                        convo.say('*Phew!*');
                        convo.next();
                    }
                }
            ]);
        });
    });


};

function formatUptime(uptime) {

    var hours   = Math.floor(uptime / 3600);
    var minutes = Math.floor((uptime - (hours * 3600)) / 60);
    var seconds = uptime - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+' hrs : '+minutes+' minutes : '+seconds + ' seconds';
}

module.exports = baseResponses;