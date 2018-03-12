var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');
var dayOfTheWeekResponses = require('../responses/dayOfTheWeek');
var patterns = require('../helpers/regexPatterns');
var love = require('../responses/loveMachine');
var insults = require('../helpers/getInsult');
var constants = require('../slackConstants');
var S = require('string');
var _ = require('lodash');
var moment = require('moment');
var characterLimit = 50;
var unirest = require('unirest');

module.exports = {

    callMeHandler: function (appCache, controller, bot, message) {
        var profane = appCache.get("profane");
        var result = {found: false, curse: ''};
        var nameExtracted = message.text.match(patterns.getMyNameRegex())[1];
        var name = '';
        if (nameExtracted) {
            name = S(nameExtracted).replaceAll(":", "").s;
        }

        var length = name.length;
        var tooLong = false;

        if (length > characterLimit) {
            name = S(name).left(characterLimit).s;
            tooLong = true;
        }
        _.forEach(profane.profaneList, function (curse) {
            if (name.indexOf(curse) > -1) {
                result.found = true;
                result.curse = curse;
            }
        });

        if (name.search(patterns.getInvalidNameRegex()) !== -1) {
            bot.reply(message, 'woah bro I cannot call you that.');
        } else if (messageUtils.multiSearchOr(name, profane.profaneList)) {
            bot.reply(message, 'woah bro I cannot call you that ' + result.curse);
        } else {
            controller.storage.users.get(message.user, function (err, user) {
                if (!user) {
                    user = {
                        id: message.user,
                    };
                }
                user.name = name;

                controller.storage.users.save(user, function (err, id) {
                    var loveMsg = love.getLoveReactionForName(user.name);
                    if (loveMsg) {
                        loveMsg = " I kind of like that name." + loveMsg;
                    }

                    if (tooLong) {
                        bot.reply(message, 'woah bro that\'s a long ass name.. im gonna cut yah off and call yah `' + name + '`');
                    } else {
                        bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.' + loveMsg);
                    }
                });

                unirest.get("https://montanaflynn-gender-guesser.p.mashape.com/?name=" + name)
                    .header("X-Mashape-Key", process.env.MASHAPEKEY)
                    .header("Accept", "application/json")
                    .end(function (result) {
                        var gender = '';
                        if (result && result.status == 200) {
                            if (result.body.gender) {
                                gender = result.body.gender;
                            }
                            var genderMsg = '';
                            if (gender) {
                                if (gender == 'male') {
                                    genderMsg = "\nThat's a nice manly name :muscle::skin-tone-4:";
                                }
                                if (gender == 'female') {
                                    genderMsg = "\nSo you're a bad ass female! That's right we need more ladies up in here! :dancer::skin-tone-4:";
                                }
                            }
                            if (genderMsg) {
                                bot.reply(message, genderMsg);
                            }
                        }

                    });

            });
        }

    },
    setNameHandler: function (appCache, controller, bot, message) {
        var profane = appCache.get("profane");
        var result = {found: false, curse: ''};

        controller.storage.users.get(message.user, function (err, user) {
            if (user && user.name) {
                bot.reply(message, 'Your name is ' + user.name + ' ' + love.getLoveReactionForName(user.name));
            } else {
                bot.startConversation(message, function (err, convo) {
                    if (!err) {
                        convo.say('I do not know your name yet!');

                        convo.ask('What should I call you?', function (response, convo) {
                            var name = S(response.text).replaceAll(":", "").s;
                            convo.ask('You want me to call you `' + name + '`?', [
                                {
                                    pattern: 'yes',
                                    callback: function (response, convo) {
                                        // since no further messages are queued after this,
                                        // the conversation will end naturally with status == 'completed'
                                        convo.next();
                                    }
                                },
                                {
                                    pattern: 'no',
                                    callback: function (response, convo) {
                                        // stop the conversation. this will cause it to end with status == 'stopped'
                                        convo.stop();
                                    }
                                },
                                {
                                    default: true,
                                    callback: function (response, convo) {
                                        convo.repeat();
                                        convo.next();
                                    }
                                }
                            ]);

                            convo.next();

                        }, {'key': 'nickname'}); // store the results in a field called nickname

                        convo.on('end', function (convo) {
                            if (convo.status == 'completed') {
                                bot.reply(message, 'OK! I will update my god dang notes...');

                                var tooLong = false;


                                controller.storage.users.get(message.user, function (err, user) {
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
                                    _.forEach(profane.profaneList, function (curse) {
                                        if (user.name.indexOf(curse) > -1) {
                                            result.found = true;
                                            result.curse = curse;
                                        }
                                    });

                                    if (user.name.search(patterns.getInvalidNameRegex()) !== -1) {
                                        bot.reply(message, 'woah bro I cannot call you that.');
                                    } else if (messageUtils.multiSearchOr(user.name, profane.profaneList)) {
                                        bot.reply(message, 'woah bro I cannot call you that ' + result.curse);
                                    } else {
                                        controller.storage.users.save(user, function (err, id) {
                                            var loveMsg = love.getLoveReactionForName(user.name);
                                            if (loveMsg) {
                                                loveMsg = " I kind of like that name." + loveMsg;
                                            }
                                            if (tooLong) {
                                                bot.reply(message, 'woah bro that\'s a long ass name.. im gonna cut yah off and call yah `' + name + '`');
                                            } else {
                                                bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.' + loveMsg);
                                            }
                                        });
                                    }

                                });

                            } else {
                                // this happens if the conversation ended prematurely for some reason
                                bot.reply(message, 'OK, never mind!');
                            }
                        });
                    }
                });
            }
        });


    },

    getMyBirthdayHandler: function (controller, bot, message) {
        var myRegex = /my birthday/;
        //message.text.search(monthDayRegex)
        // check if user wants to see their birthday
        if (message.text.search(myRegex) !== -1) {
            controller.storage.users.get(message.user, function (err, user) {
                if (user && user.birthday) {
                    var birthdayDate = moment(user.birthday, "MM/DD");
                    var now = moment();
                    var difference, duration;

                    var secondPart = '';
                    if (now.isSame(birthdayDate, 'month') && now.isSame(birthdayDate, 'day')) {
                        secondPart = " AND THAT IS TODAY HAPPY GAHDAMN BIRTHDAY!!!"
                    } else if (birthdayDate.isAfter(now)) {
                        difference = birthdayDate.diff(now);
                        duration = moment.duration(difference);
                        secondPart = ", you\'ve still got " + duration.humanize() + " until your birthday."
                    } else if (birthdayDate.isBefore(now)) {
                        birthdayDate = birthdayDate.add(1, "years");
                        difference = birthdayDate.diff(now);
                        duration = moment.duration(difference);
                        secondPart = ", you\'ve still got " + duration.humanize() + " until your birthday."
                    }

                    if (user.name) {
                        bot.reply(message, "YO " + user.name.toUpperCase() + "! Your birthday is on " + birthdayDate.format("MMMM Do") + secondPart + " :birthday: :fist::skin-tone-5:");
                    } else {
                        bot.reply(message, "Your birthday is on " + birthdayDate.format("MMMM Do") + secondPart + " :birthday: :fist::skin-tone-5:");
                    }

                } else {
                    var sryMsg = "Sorry I dont know your birthday. If you want me to remember your birthday, say `@" + constants.getBotUsername() + " my birthday is MM/DD`";
                    bot.reply(message, sryMsg);
                }

            });
        } else {
            var re = /<@(.*)>/g;
            var m;
            if (message.text.search(re) !== -1) {
                while ((m = re.exec(message.text)) !== null) {

                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }
                    var userToFind = m[1];
                    controller.storage.users.get(userToFind, function (err, user) {
                        if (user && user.birthday) {
                            var birthdayDate = moment(user.birthday, "MM/DD");
                            var now = moment();
                            var difference, duration;

                            var secondPart = '';
                            if (now.isSame(birthdayDate, 'month') && now.isSame(birthdayDate, 'day')) {
                                secondPart = " AND THAT IS TODAY HAPPY GAHDAMN BIRTHDAY!!!";
                            } else if (birthdayDate.isAfter(now)) {
                                difference = birthdayDate.diff(now);
                                duration = moment.duration(difference);
                                secondPart = ", bro\'s still got " + duration.humanize() + " until their birthday.";
                            } else if (birthdayDate.isBefore(now)) {
                                birthdayDate = birthdayDate.add(1, "years");
                                difference = birthdayDate.diff(now);
                                duration = moment.duration(difference);
                                secondPart = ", bro\'s still got " + duration.humanize() + " until their birthday.";
                            }

                            if (user.name) {
                                bot.reply(message, user.name + "'s birthday is on " + birthdayDate.format("MMMM Do") + secondPart + " :birthday: :fist::skin-tone-5:");
                            } else {
                                bot.reply(message, "<@" + userToFind + "> birthday is on " + birthdayDate.format("MMMM Do") + secondPart + " :birthday: :fist::skin-tone-5:");
                            }

                        } else {
                            var sryMsg = "Sorry I dont know <@" + userToFind + "> birthday. Tell them to set a birthday with `@" + constants.getBotUsername() + " my birthday is MM/DD`";
                            bot.reply(message, sryMsg);
                        }

                    });
                }

            } else {
                var sryMsg = "Sorry I dont know what you are asking";
                bot.reply(message, sryMsg);
            }


        }
    },

    setMyBirthdayHandler: function (controller, bot, message) {
        var monthDayRegex = /[0-9][0-9]\/[0-9][0-9]/;
        var sryMsg = "Sorry I didn't get that. If you want me to remember your birthday, say `@" + constants.getBotUsername() + " my birthday is MM/DD`";
        if (message.text.search(monthDayRegex) !== -1) {
            var m;
            if ((m = monthDayRegex.exec(message.text)) !== null) {
                if (m.index === monthDayRegex.lastIndex) {
                    re.lastIndex++;
                }
                var birthdayMonthDay = m[0];
                if (birthdayMonthDay) {
                    var birthMonth = birthdayMonthDay.split('/')[0];
                    var birthDay = birthdayMonthDay.split('/')[1];
                    if (parseInt(birthMonth) > 12 || parseInt(birthDay) > 31) {
                        bot.reply(message, sryMsg + " You entered " + birthdayMonthDay + " which is not a valid Month / Day combination.");
                    } else if (!moment(birthdayMonthDay, "MM/DD").isValid()) {
                        bot.reply(message, sryMsg + " You entered " + birthdayMonthDay + " which is not a valid Month / Day combination.");
                    } else {
                        bot.startConversation(message, function (err, convo) {

                            convo.ask("Great. Just to confirm should I remember your birthday on `" + birthdayMonthDay + "`? Say `yes` or `no`", function (response, convo) {

                                if (response.text.match(bot.botkit.utterances.yes)) {

                                    controller.storage.users.get(message.user, function (err, user) {
                                        if (!user) {
                                            user = {
                                                id: message.user,
                                            };
                                        }
                                        user.birthday = birthdayMonthDay;

                                        controller.storage.users.save(user, function (err, id) {
                                            var birthdayDate = moment(birthdayMonthDay, "MM/DD");

                                            bot.reply(message, "Ok I've got your birthday down as " + birthdayDate.format("MMMM Do") + " :birthday: :fist::skin-tone-5:");
                                        });
                                    });

                                } else {
                                    bot.reply(message, "OK. I'll pretend this never happened.");
                                }

                                convo.stop();
                            });

                        });

                    }
                } else {
                    bot.reply(message, sryMsg);
                }

            }
        } else {
            bot.reply(message, sryMsg);
        }

    },

    sendMorninToHandler: function (bot, message) {

        var placeholder = message.text.split("send mornin to ")[1];
        var user = placeholder[0];
        var channel = 'general';

        bot.startConversation(message, function (err, convo) {

            if (!user) {

                bot.reply(message, "Sorry I didn't get that. If you want me to send a mornin' mornin' to someone, say `@" + constants.getBotUsername() + " send mornin to @username`");
                convo.stop();

            } else {

                convo.ask("No problem! Do make sure I've been invited to that channel first though. \n Should I tell " + user + " you requested this? Say `yes` or `no`", function (response, convo) {

                    if (response.text === 'yes' || response.text === 'Yes') {

                        bot.reply(message, "Will do! Check <#" + channel + ">");
                        var morninMessage = dayOfTheWeekResponses.getMikeMorninTimeSensitive(null);

                        messageUtils.postMessage(bot, channel, "Yo " + user + ", <@" + message.user + "> wants me to tell yah, " + morninMessage);

                    } else {
                        var msg = dayOfTheWeekResponses.getMikeMorninTimeSensitive(null);

                        bot.reply(message, "Sneaky! Check <#" + channel + ">");

                        messageUtils.postMessage(bot, channel, user + ' ' + msg);

                    }

                    convo.stop();

                });
            }
        })

    },
    haveArgumentHandler: function (controller, bot, message) {
        var _this = this;
        bot.startConversation(message, function (err, argConversation) {

            argConversation.ask("ok you wanna start a " + vocabulary.getMikeDang() + " beef with me? Say `yes` or `no`", function (response, argQuestion) {

                if (response.text === 'yes' || response.text === 'Yes') {

                    _this.startArgument(bot, message);

                } else {
                    bot.reply(message, "Aww damn, alright.. I'll get yah next time.");
                }

                argQuestion.stop();

            });


        }.bind(this));

    },

    startArgument: function (bot, message) {

        bot.startConversation(message, function (err, argConversation) {

            argConversation.ask("ok " + vocabulary.getInsultName() + " prepare to get insulted! if you've had enough just say `stop`", function (response, mainArgConversation) {

                if (response.text.toLowerCase() !== 'stop') {

                    insults.postMikeInsult(bot, message, message.user, null);

                } else {
                    bot.reply(message, "OK ok. I'm through with you.");

                    mainArgConversation.stop();
                }


            });

        });

    }



};