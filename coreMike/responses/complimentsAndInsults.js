const messageUtils = require('../helpers/messageUtils');
const vocabulary = require('../helpers/vocabulary');
const constants = require('../slackConstants');
const async = require('async');
const _ = require('lodash');

const development = process.env.NODE_ENV !== 'production';

module.exports = {

  sendInsultToHandler(controller, bot, message) {
    const user = message.text.split('send insult to ')[1];

    let channel = 'general';
    if (development) {
      channel = 'private-testing';
    }

    bot.startConversation(message, (err, convo) => {
      if (!user || !channel) {
        convo.say(`Sorry I didn't get that. If you want me to send an insult to someone, say \`@${constants.getBotUsername()} send insult to @username\``);
        convo.next();
      } else {
        const recipientUser = messageUtils.getUsernameFromUserMessage(message.text);

        if (recipientUser === message.user) {
          convo.say('Sorry, you sneaky asshole, you already suck.. I won\'t insult you further.');
          convo.next();
        } else if (recipientUser === constants.getBotUserID()) {
          convo.say('Sorry, I know I already suck.. I won\'t insult myself further.');
          convo.next();
        } else {
          this.addInsultToUser(recipientUser, controller, (totalInsults) => {
            bot.botkit.log(`Total insults for ${recipientUser} is: ${totalInsults}`);
          });

          convo.ask(`No problem! \n Should I tell ${user} you sent this? Say \`yes\` or \`no\``, (response, nextConvo) => {
            if (response.text === 'yes' || response.text === 'Yes') {
              bot.reply(message, `Will do! Check ${constants.getGeneralChannelLink()}`);

              messageUtils.getUsernameFromController(controller, message.user, (username) => {
                vocabulary.getMikeInsultLowercase((insult) => {
                  messageUtils.postMessage(bot, channel, `Yo ${user}, ${username} (<@${message.user}>) wants me to tell yah, ${insult}`, channel);
                });
              });
            } else {
              bot.reply(message, `Sneaky! Check ${constants.getGeneralChannelLink()}`);
              vocabulary.getMikeInsultLowercase((insult) => {
                messageUtils.postMessage(bot, channel, `Yo ${user}, ${vocabulary.getInsultIntro()} ${insult}`);
              });
            }

            nextConvo.next();
          });
        }
      }
    });
  },

  sendComplimentHandler(controller, bot, message) {
    const user = message.text.split('send compliment to ')[1];

    let channel = 'general';
    if (development) {
      channel = 'private-testing';
    }

    bot.startConversation(message, (err, convo) => {
      if (!user || !channel) {
        convo.say(`${"Sorry I didn't get that. If you want me to send a compliment " +
          'to someone, say `@'}${constants.getBotUsername()} send compliment to @username\``);
        convo.next();
      } else {
        const recipientUser = messageUtils.getUsernameFromUserMessage(message.text);

        if (recipientUser === message.user) {
          convo.say(`What do you think this is? A ${vocabulary.getMikeDang()} charity? Get your compliments elsewhere.`);
          convo.next();
        } else if (recipientUser === constants.getBotUserID()) {
          convo.say("Sorry, I know I'm already awesome.. I don't need further compliments.");
          convo.next();
        } else {
          this.addComplimentToUser(recipientUser, controller, (totalInsults) => {
            bot.botkit.log(`Total insults for ${recipientUser} is: ${totalInsults}`);
          });

          convo.ask(`No problem! \n Should I tell ${user} you sent this? Say \`yes\` or \`no\``, (response, nextConvo) => {
            if (response.text === 'yes' || response.text === 'Yes') {
              bot.reply(message, `Will do! Check ${constants.getGeneralChannelLink()}`);
              messageUtils.getUsernameFromController(controller, message.user, (username) => {
                messageUtils.postMessage(bot, channel, `Yo ${user}, ${username} (<@${message.user}>) wants me to tell yah, ${
                  vocabulary.getMikeCompliment()}`);
              });
            } else {
              bot.reply(message, `Sneaky! Check ${constants.getGeneralChannelLink()}`);

              messageUtils.postMessage(bot, channel, `Yo ${user}, I just wanted to tell yah, ${vocabulary.getMikeCompliment()}`);
            }

            nextConvo.stop();
          });
        }
      }
    });
  },
  handleInsultLeaderBoardMessage(controller, bot, message) {
    const leaderboardHeader = '*Mike\'s Naughty List Leaders :rage: * :: Ranked by total insults received\n';

    // first get a list of user objects back from slack
    messageUtils.getUsers(bot, (users) => {
      // asynchronously transform the list of users with fist data
      async.transform(users, (acc, user, index, callback) => {
        const updatedUser = user;
        controller.storage.users.get(user.id, (err, storageUser) => {
          if (storageUser) {
            updatedUser.insulted = storageUser.insulted ? storageUser.insulted : 0;
            acc.push(updatedUser);
            callback(null);
          }
        });
      }, (err, usersWithInsults) => {
        // returned results of member objects with fist numbers
        let leaderboardMessage = leaderboardHeader;
        const usersWithInsultsOrdered = _.orderBy(usersWithInsults, ['insulted'], ['desc']);
        let i = 0;
        _.forEach(usersWithInsultsOrdered, (member) => {
          // only output members who have fists
          if (member.insulted && member.insulted > 0) {
            i += 1;
            let rankMsg = `${i}). ${member.name} *${member.insulted}*`;
            if (member.insulted > 30) {
              rankMsg += ` ... ${vocabulary.getMikeDang()} you're a ${vocabulary.getInsultName()}`;
            }
            leaderboardMessage += `${rankMsg}\n`;
          }
        });
        bot.reply(message, leaderboardMessage);
      });
    });
  },

  handleComplimentLeaderBoardMessage(controller, bot, message) {
    const leaderboardHeader = '*Mike\'s Good List :angel: * :: Ranked by total compliments received\n';

    // first get a list of user objects back from slack
    messageUtils.getUsers(bot, (users) => {
      // asynchronously transform the list of users with fist data
      async.transform(users, (acc, user, index, callback) => {
        const updatedUser = user;
        controller.storage.users.get(user.id, (err, storageUser) => {
          if (storageUser) {
            updatedUser.complimented = storageUser.complimented ? storageUser.complimented : 0;
            acc.push(updatedUser);
            callback(null);
          }
        });
      }, (err, usersWithCompliments) => {
        // returned results of member objects with fist numbers
        let leaderboardMessage = leaderboardHeader;
        const usersWithComplimentsOrdered = _.orderBy(usersWithCompliments, ['complimented'], ['desc']);
        let i = 0;
        _.forEach(usersWithComplimentsOrdered, (member) => {
          // only output members who have fists
          if (member.complimented && member.complimented > 0) {
            i += 1;
            const rankMsg = `${i}). ${member.name} *${member.complimented}*`;
            leaderboardMessage += `${rankMsg}\n`;
          }
        });
        bot.reply(message, leaderboardMessage);
      });
    });
  },

  addInsultToUser(userId, controller, callback) {
    try {
      controller.storage.users.get(userId, (err, user) => {
        let totalInsults = 1;
        let updatedUser = user;
        if (!user) {
          updatedUser = {
            id: userId,
            insulted: 1,
          };
        } else {
          if (user.insulted) {
            updatedUser.insulted += 1;
          } else {
            updatedUser.insulted = 1;
          }
          totalInsults = user.insulted;
        }

        controller.storage.users.save(updatedUser, (storageErr, id) => {
          if (storageErr) {
            console.error(`Storage error occurred for user id: ${id}`, storageErr);
          }
          callback(totalInsults);
        });
      });
    } catch (e) {
      console.error(`Unable to add insult storage for user id ${userId}`, e);
    }
  },

  addComplimentToUser(userId, controller, callback) {
    try {
      controller.storage.users.get(userId, (err, user) => {
        let totalCompliments = 1;
        let updatedUser = user;
        if (!user) {
          updatedUser = {
            id: userId,
            complimented: 1,
          };
        } else {
          if (user.complimented) {
            updatedUser.complimented += 1;
          } else {
            updatedUser.complimented = 1;
          }
          totalCompliments = user.complimented;
        }

        controller.storage.users.save(updatedUser, (storageErr, id) => {
          if (storageErr) {
            console.error(`Storage error occurred for user id: ${id}`, storageErr);
          }
          callback(totalCompliments);
        });
      });
    } catch (e) {
      console.error(`Unable to add compliment storage for user id ${userId}`, e);
    }
  },
};
