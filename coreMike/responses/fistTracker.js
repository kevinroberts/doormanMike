var S = require('string');
var _ = require('lodash');
var constants = require('../slackConstants');
var async = require('async');
var vocabulary = require('../helpers/vocabulary');
var messageUtils = require('../helpers/messageUtils');
const matcher = require('matcher');
var Chance = require('chance'),
    chance = new Chance();
var development = process.env.NODE_ENV !== 'production';

var totalFistsPerDay = 5;

module.exports = {

    handleFistMessage: function (controller, bot, message) {
        var usersMessage = message.text;
        var fistText = 'Give someone a doorman mike fist by adding it after their username, like this: *@username :fist:*';

        // if this message contains an @ fist-ing
        if (S(usersMessage).contains('@U')) {
            // complain about only sending one fist at a time
            var numberOfAts = S(usersMessage).count('@');
            if (numberOfAts > 1) {
                var onePersonTxt = 'Woah there sparky! I can only give one ' + vocabulary.getMikeDang() + ' :fist::skin-tone-5: out at a time!';
                bot.reply(message, onePersonTxt);
            } else {
                // this is a single fist-ing so proceed cautiously ;)
                var username = messageUtils.getUsernameFromUserMessage(usersMessage);
                // no self fist-ing plz thanks
                if (username == message.user) {
                    var noSelfMsgs = "Woah, no self :fist::skin-tone-5:'n allowed. Spread the love and share a fist with someone who deserves it.";
                    bot.reply(message, noSelfMsgs);
                } else {

                    this.addGivenFistToUser(message.user, controller, function (totalFists) {
                        bot.botkit.log('updated fists given to users total of ' + totalFists);
                        var fistsLeft = totalFistsPerDay - totalFists;
                        var gifterMessage = '';
                        if (fistsLeft > 1) {
                            gifterMessage = messageUtils.getLinkFromUserId(username) +
                                " received a doorman mike fist from you. You have " + fistsLeft + " fists to give out today.";

                            var recipientMessage = "You just received a doorman mike :fist::skin-tone-5: from " +
                                messageUtils.getLinkFromUserId(message.user) + "!";

                            if (chance.bool({likelihood: 50})) {
                                recipientMessage += '\nYou could try :fist:\'n ' + messageUtils.getLinkFromUserId(message.user) +
                                    ' back for once? _every one deserves it once in a while_ :tm:'
                            }

                            messageUtils.postMessage(bot, username, recipientMessage);


                            this.addFistToUser(username, controller, function (totalFists) {
                                bot.botkit.log('added fist to users total of ' + totalFists);
                            });

                        } else {
                            // no more fists left to give
                            gifterMessage = "sorry, you can only give 5 doorman mike fists a day";
                        }
                        messageUtils.postMessage(bot, message.user, gifterMessage);
                    }.bind(this));

                }


            }

        } else {
            // else this is just a random fist-ing
            bot.reply(message, fistText);
        }

    },

    handleBotFist: function (controller, bot, message) {
        this.addGivenFistToUser(message.user, controller, function (totalFists) {
            bot.botkit.log('updated fists given to users total of ' + totalFists);
            var fistsLeft = totalFistsPerDay - totalFists;
            var gifterMessage = '';
            if (fistsLeft > 1) {
                gifterMessage = messageUtils.getLinkFromUserId(constants.getBotUserID()) +
                    " received a doorman mike fist from you. You have " + fistsLeft + " fists to give out today.";


                this.addFistToUser(constants.getBotUserID(), controller, function (totalFists) {
                    bot.botkit.log('added fist to bots total of ' + totalFists);
                });

            } else {
                // no more fists left to give
                gifterMessage = "sorry, you can only give 5 doorman mike fists a day";
            }
            messageUtils.postMessage(bot, message.user, gifterMessage);
        }.bind(this));

    },

    handleLeaderBoardMessage: function (controller, bot, message) {
        var leaderboardHeader = '*211 West Wacker Hustlers :fist::skin-tone-5: Leaderboard*\n';
        var leaderboardOutro = '\nSee the :fist::skin-tone-5: Leaderboard online at http://transithelper.com/leaderboard';

        // first get a list of user objects back from slack
        messageUtils.getUsers(bot, function (users) {

            // asynchronously transform the list of users with fist data
            async.transform(users, function (acc, user, index, callback) {

                controller.storage.users.get(user.id, function (err, storageUser) {
                    if (storageUser) {
                        user.fists = storageUser.fists ? storageUser.fists : 0;
                        acc.push(user);
                        callback(null);
                    }
                });

            }, function (err, usersWithFists) {
                // returned results of member objects with fist numbers
                bot.reply(message, leaderboardHeader);
                usersWithFists = _.orderBy(usersWithFists, ['fists'], ['desc']);
                var i = 0;
                _.forEach(usersWithFists, function (member) {
                    // only output members who have fists
                    if (member.fists && member.fists > 0) {
                        i++;
                        var rankMsg = i + '). ' + member.name + ' *' + member.fists + '*';
                        bot.reply(message, rankMsg);
                    }
                });
                bot.reply(message, leaderboardOutro);

            });

        });

    },

    resetFistsGiven: function (controller, bot) {
        bot.api.users.list({
            presence: 0
        }, function (err, res) {
            if (res.members) {
                bot.botkit.log("returned " + res.members.length + " user accounts");
                _.forEach(res.members, function (member) {
                    this.resetGivenFistForUser(member.id, controller);
                }.bind(this));
            }
        }.bind(this));
    },

    addFistToUser: function (userId, controller, callback) {
        controller.storage.users.get(userId, function (err, user) {
            var totalFists = 1;
            if (!user) {
                user = {
                    id: userId,
                    fists: 1
                };
            } else {
                if (user.fists) {
                    user.fists = user.fists + 1;
                } else {
                    user.fists = 1;
                }
                totalFists = user.fists;
            }

            controller.storage.users.save(user, function (err, id) {
                callback(totalFists);
            });
        });
    },

    resetGivenFistForUser: function (userId, controller) {

        controller.storage.users.get(userId, function (err, user) {
            var resetFistTotal = 0;
            if (!user) {
                user = {
                    id: userId,
                    fistsGiven: resetFistTotal
                };
            } else {
                if (user.fistsGiven) {
                    user.fistsGiven = resetFistTotal;
                } else {
                    user.fistsGiven = resetFistTotal;
                }
            }

            controller.storage.users.save(user, function (err, id) {
                if (development) {
                    console.log('reset given fist total for ' + userId);
                }
            });
        });
    },

    addGivenFistToUser: function (userId, controller, callback) {
        controller.storage.users.get(userId, function (err, user) {
            var totalFists = 1;
            if (!user) {
                user = {
                    id: userId,
                    fistsGiven: 1
                };
            } else {
                if (user.fistsGiven) {
                    user.fistsGiven = user.fistsGiven + 1;
                } else {
                    user.fistsGiven = 1;
                }
                totalFists = user.fistsGiven;
            }

            controller.storage.users.save(user, function (err, id) {
                callback(totalFists);
            });
        });
    }

};

