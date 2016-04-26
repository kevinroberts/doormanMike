/*
 *   defines all the basic mike responses
 */
var os = require('os');
var dayOfTheWeekResponses = require('./dayOfTheWeek');
var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');
var love = require('../responses/loveMachine');
var YQLClient = require('yql-client'),
    YQL = YQLClient.YQL;

var cleverbot = require("cleverbot.io"),
    cleverbot = new cleverbot(process.env.CLEVERBOTUSER, process.env.CLEVERBOTAPI);
cleverbot.setNick("Mike");
cleverbot.create(function (err, session) {
    if (err) {
        console.log('Cleverbot create fail', err);
    } else {
        console.log('cleverbot create success.');
    }
});

var baseResponses = function(controller, callback) {

    controller.on('bot_channel_join', function (bot, message) {
        bot.reply(message, ":fist::skin-tone-5:")
    });

    controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

        messageUtils.postReaction(bot, message, 'fist');

        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                var msg = vocabulary.getPersonalMikeHello(user.name);
                bot.reply(message, msg);
            } else {
                var msg = vocabulary.getPersonalMikeHello("<@" + message.user + "> ");
                bot.reply(message, msg);
            }
        });
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
                var loveMsg = love.getLoveReactionForName(user.name);
                if (loveMsg) {
                    loveMsg = " I kind of like that name." + loveMsg;
                }
                bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.' + loveMsg);
            });
        });
    });

    controller.hears(['what is my name', 'who am i', 'what my name'], 'direct_message,direct_mention,mention', function(bot, message) {

        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Your name is ' + user.name + ' ' + love.getLoveReactionForName(user.name));
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
                                        var loveMsg = love.getLoveReactionForName(user.name);
                                        if (loveMsg) {
                                            loveMsg = " I kind of like that name." + loveMsg;
                                        }
                                        bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.' + loveMsg);

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

    controller.hears(['who killed (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {

            bot.reply(message, 'I did! And it\'s NONE OF YOUR ' + vocabulary.getMikeDang().toUpperCase() + ' BUSINESS ');

        });

    controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
        'direct_message,direct_mention,mention', function(bot, message) {

            var hostname = os.hostname();
            var uptime = formatUptime(process.uptime());

            bot.reply(message,
                ':doorman: I am a bot named <@' + bot.identity.name +
                '>. I have been alive for ' + uptime + ' on NONE OF YO GODANG BUSINESS SERVER. (' + hostname + ')');

        });

    controller.hears(['hey', 'sup', 'whats up', 'whats good', 'hows it going'],
        'direct_message,direct_mention,mention', function(bot, message) {

            var msgPt2 = dayOfTheWeekResponses.statementResponse();

            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    var msg = vocabulary.getPersonalMikeHello(user.name).toUpperCase();
                    bot.reply(message, msg + ' ' + msgPt2);
                } else {
                    var msg = vocabulary.getPersonalMikeHello("<@" + message.user + "> ").toUpperCase();
                    bot.reply(message, msg + ' ' + msgPt2);
                }
            });
        });


    controller.hears(["what time is it"], ["direct_message","direct_mention","mention","ambient"], function(bot, message) {

        messageUtils.postReaction(bot, message, 'timer_clock');

        var msg = "it's time to get a " + vocabulary.getMikeDang() + " watch!";
        var loveMsg = love.getLoveReactionForName(message.user);
        if (love) {
            msg += loveMsg;
        }
        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, user.name + ' ' + msg);
            } else {
                bot.reply(message, "<@" + message.user + "> " + msg);
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
            var myDate = new Date();
            // only trigger if hour is before noon
            if (myDate.getHours() < 12) {
                bot.startTyping(message);
                bot.reply(message, "<@" + message.user + "> " + vocabulary.getMikeMornin() + "\n" + dayOfTheWeekResponses.statementResponse());
            }
            /* Hour is from noon to 5pm (actually to 5:59 pm) */
            else if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
                bot.startTyping(message);
                bot.reply(message, "<@" + message.user + "> get to that sack-room it's da afternoon yo!");
            }
            /* the hour is after 5pm, so it is between 6pm and midnight */
            else if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
                bot.startTyping(message);
                bot.reply(message, "<@" + message.user + "> " + vocabulary.getMikeDang() + " :sleeping: ");
            }

        });

    controller.hears('(.*)weather?',["direct_message","direct_mention","mention"],function(bot,message) {

        bot.startTyping(message);

        // JSON format back from Yahoo {
        //    "code": "28",
        //    "date": "Thu, 21 Apr 2016 10:00 AM CDT",
        //    "temp": "62",
        //    "text": "Mostly Cloudy"
        //}
        YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Chicago, IL")', function(r) {
            if (r.query.results.channel.item.condition != null) {
                var currentWeather = r.query.results.channel.item.condition;
                var currentTemp = parseInt(currentWeather.temp);
                var weatherReaction = '';

                if (currentTemp < 40) {
                    weatherReaction = ' and you better have a coat because its ' + vocabulary.getMikeDang() + ' freezin';
                }
                else if (currentTemp < 50) {
                    weatherReaction = ' and you better have a coat because its ' + vocabulary.getMikeDang() + ' chilly';
                }
                else if (currentTemp > 70) {
                    weatherReaction += ' and you better have a some shorts on cuz its ' + vocabulary.getMikeDang() + ' hot out there';
                }
                bot.reply(message, 'the weather today is ' + vocabulary.getMikeDang() + ' ' + currentWeather.text.toLowerCase() + weatherReaction);

            } else {
                bot.reply(message, 'the weather is ' + vocabulary.getMikeDang() + ' stick yo head outside');
            }

        });


    });

    controller.on("user_channel_join", function(bot, message) {
        messageUtils.postReaction(bot, message, 'fist');
        var intro = "Welcome <@"+message.user+">! May I be the first to welcome you to the " +message.channel+" channel.";
        bot.reply(message, intro);
    });

    controller.hears(["doorman-mike"], ["ambient"], function(bot, message) {
        var intro = "<@"+message.user+"> what's up?";
        bot.reply(message, intro);
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

    /*
        Catch all other responses that are not defined and pass it through cleverbot.io
     */
    controller.hears('', 'direct_message,direct_mention,mention', function (bot, message) {
        bot.startTyping(message);
        var msg = message.text;
        cleverbot.ask(msg, function (err, response) {
            if (!err) {
                var msg = response;
                if (response.indexOf('HAL') !== -1) {
                    msg = response.replace('HAL', "<@"+message.user+">")
                }
                bot.reply(message, msg);
            } else {
                bot.botkit.log('cleverbot err: ' + err);
                bot.reply(message, vocabulary.getWaster());
            }
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