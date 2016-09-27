var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');
var insults = require('../helpers/getInsult');
var constants = require('../slackConstants');
var S = require('string');
var async = require('async');
var _ = require('lodash');
const development = process.env.NODE_ENV !== 'production';

module.exports = {

    sendInsultToHandler: function (controller, bot, message) {
        var _this = this;
        var user = message.text.split("send insult to ")[1];

        var channel = 'general';
        if (development) {
            channel = 'private-testing';
        }

        bot.startConversation(message, function (err, convo) {
            if (!user | !channel) {

                convo.say("Sorry I didn't get that. If you want me to send an insult to someone, say `@" + constants.getBotUsername() + " send insult to @username`");
                convo.next();

            } else {

                var recipientUser = messageUtils.getUsernameFromUserMessage(message.text);

                if (recipientUser == message.user) {
                    convo.say("Sorry, you sneaky asshole, you already suck.. I won\'t insult you further.");
                    convo.next();
                } else if (recipientUser == constants.getBotUserID()) {
                    convo.say("Sorry, I know I already suck.. I won\'t insult myself further.");
                    convo.next();
                } else {

                    _this.addInsultToUser(recipientUser, controller, function (totalInsults) {
                        bot.botkit.log("Total insults for " + recipientUser + " is: " + totalInsults);
                    });

                    convo.ask("No problem! \n Should I tell " + user + " you sent this? Say `yes` or `no`", function (response, convo) {

                        if (response.text === 'yes' | response.text === 'Yes') {

                            bot.reply(message, "Will do! Check " + constants.getGeneralChannelLink());

                            insults.postMikeInsult(bot, message, "Yo " + user + ", <@" + message.user + "> wants me to tell yah,", channel);

                        } else {

                            bot.reply(message, "Sneaky! Check " + constants.getGeneralChannelLink());

                            insults.postMikeInsult(bot, message, user, channel);

                        }

                        convo.next();

                    });

                }
            }
        });

    },

    sendComplimentHandler: function (controller, bot, message) {
        var _this = this;
        var user = message.text.split("send compliment to ")[1];

        var channel = 'general';
        if (development) {
            channel = 'private-testing';
        }

        bot.startConversation(message, function (err, convo) {
            if (!user | !channel) {

                convo.say("Sorry I didn't get that. If you want me to send a compliment " +
                    "to someone, say `@" + constants.getBotUsername() + " send compliment to @username`");
                convo.next();

            } else {

                var recipientUser = messageUtils.getUsernameFromUserMessage(message.text);

                if (recipientUser == message.user) {
                    convo.say("What do you think this is? A " + vocabulary.getMikeDang() + " charity? Get your compliments elsewhere.");
                    convo.next();
                } else if (recipientUser == constants.getBotUserID()) {
                    convo.say("Sorry, I know I'm already awesome.. I don't need further compliments.");
                    convo.next();
                } else {

                    _this.addComplimentToUser(recipientUser, controller, function (totalInsults) {
                        bot.botkit.log("Total insults for " + recipientUser + " is: " + totalInsults);
                    });

                    convo.ask("No problem! \n Should I tell " + user + " you sent this? Say `yes` or `no`", function (response, convo) {

                        if (response.text === 'yes' | response.text === 'Yes') {

                            bot.reply(message, "Will do! Check " + constants.getGeneralChannelLink());

                            messageUtils.postMessage(bot, channel, "Yo " + user + ", <@" + message.user + "> wants me to tell yah, " + vocabulary.getMikeCompliment());

                        } else {

                            bot.reply(message, "Sneaky! Check " + constants.getGeneralChannelLink());

                            messageUtils.postMessage(bot, channel, "Yo " + user + ", I just wanted to tell yah, " + vocabulary.getMikeCompliment());

                        }

                        convo.stop();

                    });
                }


            }
        });
    },
    handleInsultLeaderBoardMessage: function (controller, bot, message) {
        var leaderboardHeader = '*Mike\'s Naughty List Leaders :angry: *\nRanked by total insults received\n';

        // first get a list of user objects back from slack
        messageUtils.getUsers(bot, function (users) {

            // asynchronously transform the list of users with fist data
            async.transform(users, function (acc, user, index, callback) {

                controller.storage.users.get(user.id, function (err, storageUser) {
                    if (storageUser) {
                        user.insulted = storageUser.insulted ? storageUser.insulted : 0;
                        acc.push(user);
                        callback(null);
                    }
                });

            }, function (err, usersWithInsults) {
                // returned results of member objects with fist numbers
                bot.reply(message, leaderboardHeader);
                usersWithInsults = _.orderBy(usersWithInsults, ['insulted'], ['desc']);
                var i = 0;
                _.forEach(usersWithInsults, function (member) {
                    // only output members who have fists
                    if (member.insulted && member.insulted > 0) {
                        i++;
                        var rankMsg = i + '). ' + member.name + ' *' + member.insulted + '*';
                        bot.reply(message, rankMsg);
                    }
                });

            });

        });

    },

    handleComplimentLeaderBoardMessage: function (controller, bot, message) {
        var leaderboardHeader = '*Mike\'s Good List :angel: *\nRanked by total compliments received\n';

        // first get a list of user objects back from slack
        messageUtils.getUsers(bot, function (users) {

            // asynchronously transform the list of users with fist data
            async.transform(users, function (acc, user, index, callback) {

                controller.storage.users.get(user.id, function (err, storageUser) {
                    if (storageUser) {
                        user.complimented = storageUser.complimented ? storageUser.complimented : 0;
                        acc.push(user);
                        callback(null);
                    }
                });

            }, function (err, usersWithCompliments) {
                // returned results of member objects with fist numbers
                bot.reply(message, leaderboardHeader);
                usersWithCompliments = _.orderBy(usersWithCompliments, ['complimented'], ['desc']);
                var i = 0;
                _.forEach(usersWithCompliments, function (member) {
                    // only output members who have fists
                    if (member.complimented && member.complimented > 0) {
                        i++;
                        var rankMsg = i + '). ' + member.name + ' *' + member.complimented + '*';
                        bot.reply(message, rankMsg);
                    }
                });

            });

        });

    },

    addInsultToUser: function (userId, controller, callback) {
        controller.storage.users.get(userId, function(err, user) {
            var totalInsults = 1;
            if (!user) {
                user = {
                    id: userId,
                    insulted: 1
                };
            } else {
                if (user.insulted) {
                    user.insulted = user.insulted + 1;
                } else {
                    user.insulted = 1;
                }
                totalInsults = user.insulted;
            }

            controller.storage.users.save(user, function(err, id) {
                callback(totalInsults);
            });
        });
    },

    addComplimentToUser: function (userId, controller, callback) {
        controller.storage.users.get(userId, function(err, user) {
            var totalCompliments = 1;
            if (!user) {
                user = {
                    id: userId,
                    complimented: 1
                };
            } else {
                if (user.complimented) {
                    user.complimented = user.complimented + 1;
                } else {
                    user.complimented = 1;
                }
                totalCompliments = user.complimented;
            }

            controller.storage.users.save(user, function(err, id) {
                callback(totalCompliments);
            });
        });
    }
};