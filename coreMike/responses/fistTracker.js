const S = require('string');
const _ = require('lodash');
const constants = require('../slackConstants');
const async = require('async');
const vocabulary = require('../helpers/vocabulary');
const messageUtils = require('../helpers/messageUtils');
const Chance = require('chance');

const development = process.env.NODE_ENV !== 'production';

const totalFistsPerDay = 5;

module.exports = {

  handleFistMessage(controller, bot, message) {
    const chance = new Chance();
    const usersMessage = message.text;
    const fistText = 'Give someone a doorman mike fist by adding it after their username, like this: *@username :fist:*';

    // if this message contains an @ fist-ing
    if (S(usersMessage).contains('@U')) {
      // complain about only sending one fist at a time
      const numberOfAts = S(usersMessage).count('@');
      if (numberOfAts > 1) {
        const onePersonTxt = `Woah there sparky! I can only give one ${vocabulary.getMikeDang()} :fist::skin-tone-5: out at a time!`;
        bot.reply(message, onePersonTxt);
      } else {
        // this is a single fist-ing so proceed cautiously ;)
        const username = messageUtils.getUsernameFromUserMessage(usersMessage);
        // no self fist-ing plz thanks
        if (username === message.user) {
          const noSelfMsgs = "Woah, no self :fist::skin-tone-5:'n allowed. Spread the love and share a fist with someone who deserves it.";
          bot.reply(message, noSelfMsgs);
        } else {
          this.addGivenFistToUser(message.user, controller, (totalFists) => {
            bot.botkit.log(`updated fists given to users total of ${totalFists}`);
            const fistsLeft = totalFistsPerDay - totalFists;
            let gifterMessage = '';
            if (fistsLeft > 1) {
              gifterMessage = `${messageUtils.getLinkFromUserId(username)
              } received a doorman mike fist from you. You have ${fistsLeft} fists to give out today.`;

              let recipientMessage = `You just received a doorman mike :fist::skin-tone-5: from ${
                messageUtils.getLinkFromUserId(message.user)}!`;

              if (chance.bool({ likelihood: 50 })) {
                recipientMessage += `\nYou could try :fist:'n ${messageUtils.getLinkFromUserId(message.user)
                } back for once? _every one deserves it once in a while_ :tm:`;
              }

              messageUtils.postMessage(bot, username, recipientMessage);


              this.addFistToUser(username, controller, (totalFistsReceived) => {
                bot.botkit.log(`added fist to users total of ${totalFistsReceived}`);
              });
            } else {
              // no more fists left to give
              gifterMessage = 'sorry, you can only give 5 doorman mike fists a day';
            }
            messageUtils.postMessage(bot, message.user, gifterMessage);
          });
        }
      }
    } else {
      // else this is just a random fist-ing
      bot.reply(message, fistText);
    }
  },

  handleBotFist(controller, bot, message) {
    this.addGivenFistToUser(message.user, controller, (totalFists) => {
      bot.botkit.log(`updated fists given to users total of ${totalFists}`);
      const fistsLeft = totalFistsPerDay - totalFists;
      let gifterMessage = '';
      if (fistsLeft > 1) {
        gifterMessage = `${messageUtils.getLinkFromUserId(constants.getBotUserID())
        } received a doorman mike fist from you. You have ${fistsLeft} fists to give out today.`;


        this.addFistToUser(constants.getBotUserID(), controller, (totalFistsReceived) => {
          bot.botkit.log(`added fist to bots total of ${totalFistsReceived}`);
        });
      } else {
        // no more fists left to give
        gifterMessage = 'sorry, you can only give 5 doorman mike fists a day';
      }
      messageUtils.postMessage(bot, message.user, gifterMessage);
    });
  },

  handleLeaderBoardMessage(controller, bot, message) {
    const leaderboardHeader = '*211 West Wacker Hustlers :fist::skin-tone-5: Leaderboard*\n';
    const leaderboardOutro = '';

    // first get a list of user objects back from slack
    messageUtils.getUsers(bot, (users) => {
      // asynchronously transform the list of users with fist data
      async.transform(users, (acc, user, index, callback) => {
        controller.storage.users.get(user.id, (err, storageUser) => {
          if (storageUser) {
            const updatedUser = user;
            updatedUser.fists = storageUser.fists ? storageUser.fists : 0;
            acc.push(updatedUser);
            callback(null);
          } else {
            callback(null);
          }
        });
      }, (err, usersWithFists) => {
        // returned results of member objects with fist numbers
        let leaderboardMessage = leaderboardHeader;
        const usersWithFistsOrdered = _.orderBy(usersWithFists, ['fists'], ['desc']);
        let i = 0;
        _.forEach(usersWithFistsOrdered, (member) => {
          // only output members who have fists
          if (member.fists && member.fists > 0) {
            i += 1;
            const rankMsg = `${i}). ${member.name} *${member.fists}*`;
            leaderboardMessage += `${rankMsg}\n`;
          }
        });
        leaderboardMessage += leaderboardOutro;
        bot.reply(message, leaderboardMessage);
      });
    });
  },

  resetFistsGiven(controller, bot) {
    bot.api.users.list({
      presence: 0,
    }, (err, res) => {
      if (res.members) {
        bot.botkit.log(`returned ${res.members.length} user accounts`);
        _.forEach(res.members, (member) => {
          this.resetGivenFistForUser(member.id, controller);
        });
      }
    });
  },

  addFistToUser(userId, controller, callback) {
    controller.storage.users.get(userId, (err, user) => {
      let totalFists = 1;
      let updatedUser = user;
      if (!user) {
        updatedUser = {
          id: userId,
          fists: 1,
        };
      } else {
        if (updatedUser.fists) {
          updatedUser.fists += 1;
        } else {
          updatedUser.fists = 1;
        }
        totalFists = updatedUser.fists;
      }

      controller.storage.users.save(updatedUser, (storageErr, id) => {
        if (storageErr) {
          console.error('Storage error for user id: ', id);
        }
        callback(totalFists);
      });
    });
  },

  resetGivenFistForUser(userId, controller) {
    controller.storage.users.get(userId, (err, user) => {
      const resetFistTotal = 0;
      let updatedUser = user;
      if (!user) {
        updatedUser = {
          id: userId,
          fistsGiven: resetFistTotal,
        };
      } else if (user.fistsGiven) {
        updatedUser.fistsGiven = resetFistTotal;
      } else {
        updatedUser.fistsGiven = resetFistTotal;
      }

      controller.storage.users.save(updatedUser, (storageErr, id) => {
        if (development) {
          console.log(`reset given fist total for ${id}`);
        }
      });
    });
  },

  addGivenFistToUser(userId, controller, callback) {
    controller.storage.users.get(userId, (err, user) => {
      let totalFists = 1;
      let updatedUser = user;
      if (!user) {
        updatedUser = {
          id: userId,
          fistsGiven: 1,
        };
      } else {
        if (user.fistsGiven) {
          updatedUser.fistsGiven += 1;
        } else {
          updatedUser.fistsGiven = 1;
        }
        totalFists = user.fistsGiven;
      }

      controller.storage.users.save(updatedUser, (storageErr, id) => {
        if (storageErr) {
          console.error(`Storage error occurred for user id: ${id}`, storageErr);
        }
        callback(totalFists);
      });
    });
  },

};

