const messageUtils = require('../helpers/messageUtils');
const vocabulary = require('../helpers/vocabulary');
const dayOfTheWeekResponses = require('../responses/dayOfTheWeek');
const patterns = require('../helpers/regexPatterns');
const love = require('../responses/loveMachine');
const constants = require('../slackConstants');
const S = require('string');
const _ = require('lodash');
const moment = require('moment');

const characterLimit = 50;
const unirest = require('unirest');

const development = process.env.NODE_ENV !== 'production';

module.exports = {

  callMeHandler(appCache, controller, bot, message) {
    const profane = appCache.get('profane');
    const result = { found: false, curse: '' };
    const nameExtracted = message.text.match(patterns.getMyNameRegex())[1];
    let name = '';
    if (nameExtracted) {
      name = S(nameExtracted).replaceAll(':', '').s;
    }

    let tooLong = false;

    if (name.length > characterLimit) {
      name = S(name).left(characterLimit).s;
      tooLong = true;
    }
    _.forEach(profane.profaneList, (curse) => {
      if (name.indexOf(curse) > -1) {
        result.found = true;
        result.curse = curse;
      }
    });

    if (name.search(patterns.getInvalidNameRegex()) !== -1) {
      bot.reply(message, 'woah bro I cannot call you that.');
    } else if (messageUtils.multiSearchOr(name, profane.profaneList)) {
      bot.reply(message, `woah bro I cannot call you that ${result.curse}`);
    } else {
      controller.storage.users.get(message.user, (err, user) => {
        let updatedUser = user;
        if (!user) {
          updatedUser = {
            id: message.user,
          };
        }
        updatedUser.name = name;

        controller.storage.users.save(updatedUser, (storErr, id) => {
          if (storErr) {
            console.log('Storage Error for ID: ', id);
          }
          let loveMsg = love.getLoveReactionForName(user.name);
          if (loveMsg) {
            loveMsg = ` I kind of like that name.${loveMsg}`;
          }

          if (tooLong) {
            bot.reply(message, `woah bro that's a long ass name.. im gonna cut yah off and call yah \`${name}\``);
          } else {
            bot.reply(message, `Got it. I will call you ${user.name} from now on.${loveMsg}`);
          }
        });

        unirest.get(`https://gender-api.com/get?name=${name}&key=${process.env.GENDER_KEY}`)
          .header('Accept', 'application/json')
          .end((response) => {
            if (response && response.status === 200) {
              if (response.body.gender) {
                let genderMsg = '';
                const { gender } = response.body;
                if (gender === 'male') {
                  genderMsg = "\nThat's a nice manly name :muscle::skin-tone-4:";
                }
                if (gender === 'female') {
                  genderMsg = "\nSo you're a bad ass female! That's right we need more ladies up in here! :dancer::skin-tone-4:";
                }
                if (genderMsg) {
                  bot.reply(message, genderMsg);
                }
              }
            }
          });
      });
    }
  },
  setNameHandler(appCache, controller, bot, message) {
    const profane = appCache.get('profane');
    const result = { found: false, curse: '' };

    controller.storage.users.get(message.user, (storErr, user) => {
      if (user && user.name) {
        bot.reply(message, `Your name is ${user.name} ${love.getLoveReactionForName(user.name)}`);
      } else {
        bot.startConversation(message, (err, convo) => {
          if (!err) {
            convo.say('I do not know your name yet!');

            convo.ask('What should I call you?', (response, secondConvo) => {
              const name = S(response.text).replaceAll(':', '').s;
              secondConvo.ask(`You want me to call you \`${name}\`?`, [
                {
                  pattern: 'yes',
                  callback(nextResponse, nextConvo) {
                    // since no further messages are queued after this,
                    // the conversation will end naturally with status == 'completed'
                    nextConvo.next();
                  },
                },
                {
                  pattern: 'no',
                  callback(nextResponse, nextConvo) {
                    // stop the conversation. this will cause it to end with status == 'stopped'
                    nextConvo.stop();
                  },
                },
                {
                  default: true,
                  callback(nextResponse, nextConvo) {
                    nextConvo.repeat();
                    nextConvo.next();
                  },
                },
              ]);

              convo.next();
            }, { key: 'nickname' }); // store the results in a field called nickname

            convo.on('end', (nextConvo) => {
              if (convo.status === 'completed') {
                bot.reply(message, 'OK! I will update my god dang notes...');

                let tooLong = false;


                controller.storage.users.get(message.user, (storeRetErr, userRes) => {
                  let updatedUser = userRes;
                  if (!userRes) {
                    updatedUser = {
                      id: message.user,
                    };
                  }


                  updatedUser.name = S(convo.extractResponse('nickname')).replaceAll(':', '').s;

                  if (updatedUser.name.length > characterLimit) {
                    updatedUser.name = S(user.name).left(characterLimit).s;
                    tooLong = true;
                  }
                  _.forEach(profane.profaneList, (curse) => {
                    if (updatedUser.name.indexOf(curse) > -1) {
                      result.found = true;
                      result.curse = curse;
                    }
                  });

                  if (updatedUser.name.search(patterns.getInvalidNameRegex()) !== -1) {
                    bot.reply(message, 'woah bro I cannot call you that.');
                  } else if (messageUtils.multiSearchOr(updatedUser.name, profane.profaneList)) {
                    bot.reply(message, `woah bro I cannot call you that ${result.curse}`);
                  } else {
                    controller.storage.users.save(updatedUser, (storErr2, id) => {
                      if (storErr2) {
                        console.log('Storage error for id: ', id);
                      }
                      let loveMsg = love.getLoveReactionForName(updatedUser.name);
                      if (loveMsg) {
                        loveMsg = ` I kind of like that name.${loveMsg}`;
                      }
                      if (tooLong) {
                        bot.reply(message, `woah bro that's a long ass name.. im gonna cut yah off and call yah \`${updatedUser.name}\``);
                      } else {
                        bot.reply(message, `Got it. I will call you ${updatedUser.name} from now on.${loveMsg}`);
                      }
                    });
                  }
                });
              } else {
                // this happens if the conversation ended prematurely for some reason
                bot.reply(message, 'OK, never mind!');
                nextConvo.stop();
              }
            });
          }
        });
      }
    });
  },

  getMyBirthdayHandler(controller, bot, message) {
    const myRegex = /my birthday/;
    // message.text.search(monthDayRegex)
    // check if user wants to see their birthday
    if (message.text.search(myRegex) !== -1) {
      controller.storage.users.get(message.user, (err, user) => {
        if (user && user.birthday) {
          let birthdayDate = moment(user.birthday, 'MM/DD');
          const now = moment();
          let difference;
          let duration;

          let secondPart = '';
          if (now.isSame(birthdayDate, 'month') && now.isSame(birthdayDate, 'day')) {
            secondPart = ' AND THAT IS TODAY HAPPY GAHDAMN BIRTHDAY!!!';
          } else if (birthdayDate.isAfter(now)) {
            difference = birthdayDate.diff(now);
            duration = moment.duration(difference);
            secondPart = `, you've still got ${duration.humanize()} until your birthday.`;
          } else if (birthdayDate.isBefore(now)) {
            birthdayDate = birthdayDate.add(1, 'years');
            difference = birthdayDate.diff(now);
            duration = moment.duration(difference);
            secondPart = `, you've still got ${duration.humanize()} until your birthday.`;
          }

          if (user.name) {
            bot.reply(message, `YO ${user.name.toUpperCase()}! Your birthday is on ${birthdayDate.format('MMMM Do')}${secondPart} :birthday: :fist::skin-tone-5:`);
          } else {
            bot.reply(message, `Your birthday is on ${birthdayDate.format('MMMM Do')}${secondPart} :birthday: :fist::skin-tone-5:`);
          }
        } else {
          const sryMsg = `Sorry I dont know your birthday. If you want me to remember your birthday, say \`@${constants.getBotUsername()} my birthday is MM/DD\``;
          bot.reply(message, sryMsg);
        }
      });
    } else {
      const re = /<@(.*)>/g;
      let m;
      if (message.text.search(re) !== -1) {
        while ((m = re.exec(message.text)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          var userToFind = m[1];
          controller.storage.users.get(userToFind, (err, user) => {
            if (user && user.birthday) {
              let birthdayDate = moment(user.birthday, 'MM/DD');
              const now = moment();
              let difference,
                duration;

              let secondPart = '';
              if (now.isSame(birthdayDate, 'month') && now.isSame(birthdayDate, 'day')) {
                secondPart = ' AND THAT IS TODAY HAPPY GAHDAMN BIRTHDAY!!!';
              } else if (birthdayDate.isAfter(now)) {
                difference = birthdayDate.diff(now);
                duration = moment.duration(difference);
                secondPart = `, bro's still got ${duration.humanize()} until their birthday.`;
              } else if (birthdayDate.isBefore(now)) {
                birthdayDate = birthdayDate.add(1, 'years');
                difference = birthdayDate.diff(now);
                duration = moment.duration(difference);
                secondPart = `, bro's still got ${duration.humanize()} until their birthday.`;
              }

              if (user.name) {
                bot.reply(message, `${user.name}'s birthday is on ${birthdayDate.format('MMMM Do')}${secondPart} :birthday: :fist::skin-tone-5:`);
              } else {
                bot.reply(message, `<@${userToFind}> birthday is on ${birthdayDate.format('MMMM Do')}${secondPart} :birthday: :fist::skin-tone-5:`);
              }
            } else {
              const sryMsg = `Sorry I dont know <@${userToFind}> birthday. Tell them to set a birthday with \`@${constants.getBotUsername()} my birthday is MM/DD\``;
              bot.reply(message, sryMsg);
            }
          });
        }
      } else {
        const sryMsg = 'Sorry I dont know what you are asking';
        bot.reply(message, sryMsg);
      }
    }
  },

  setMyBirthdayHandler(controller, bot, message) {
    const monthDayRegex = /[0-9][0-9]\/[0-9][0-9]/;
    const sryMsg = `Sorry I didn't get that. If you want me to remember your birthday, say \`@${constants.getBotUsername()} my birthday is MM/DD\``;
    if (message.text.search(monthDayRegex) !== -1) {
      let m;
      if ((m = monthDayRegex.exec(message.text)) !== null) {
        if (m.index === monthDayRegex.lastIndex) {
          re.lastIndex++;
        }
        const birthdayMonthDay = m[0];
        if (birthdayMonthDay) {
          const birthMonth = birthdayMonthDay.split('/')[0];
          const birthDay = birthdayMonthDay.split('/')[1];
          if (parseInt(birthMonth, 10) > 12 || parseInt(birthDay, 10) > 31) {
            bot.reply(message, `${sryMsg} You entered ${birthdayMonthDay} which is not a valid Month / Day combination.`);
          } else if (!moment(birthdayMonthDay, 'MM/DD').isValid()) {
            bot.reply(message, `${sryMsg} You entered ${birthdayMonthDay} which is not a valid Month / Day combination.`);
          } else {
            bot.startConversation(message, (err, convo) => {
              convo.ask(`Great. Just to confirm should I remember your birthday on \`${birthdayMonthDay}\`? Say \`yes\` or \`no\``, (response, convo) => {
                if (response.text.match(bot.botkit.utterances.yes)) {
                  controller.storage.users.get(message.user, (err, user) => {
                    if (!user) {
                      user = {
                        id: message.user,
                      };
                    }
                    user.birthday = birthdayMonthDay;

                    controller.storage.users.save(user, (err, id) => {
                      const birthdayDate = moment(birthdayMonthDay, 'MM/DD');

                      bot.reply(message, `Ok I've got your birthday down as ${birthdayDate.format('MMMM Do')} :birthday: :fist::skin-tone-5:`);
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

  sendMorninToHandler(bot, message) {
    const user = message.text.split('send mornin to ')[1];
    let channel = 'general';
    if (development) {
      channel = 'private-testing';
    }

    bot.startConversation(message, (err, convo) => {
      if (!user) {
        bot.reply(message, `Sorry I didn't get that. If you want me to send a mornin' mornin' to someone, say \`@${constants.getBotUsername()} send mornin to @username\``);
        convo.stop();
      } else {
        convo.ask(`No problem! \n Should I tell ${user} you requested this? Say \`yes\` or \`no\``, (response, convo) => {
          if (response.text === 'yes' || response.text === 'Yes') {
            bot.reply(message, `Will do! Check ${constants.getGeneralChannelLink()}`);
            const morninMessage = dayOfTheWeekResponses.getMikeMorninTimeSensitive(null);

            messageUtils.postMessage(bot, channel, `Yo ${user}, <@${message.user}> wants me to tell yah, ${morninMessage}`);
          } else {
            const msg = dayOfTheWeekResponses.getMikeMorninTimeSensitive(null);

            bot.reply(message, `Sneaky! Check ${constants.getGeneralChannelLink()}`);

            messageUtils.postMessage(bot, channel, `Yo ${user}, I was requested to tell you ${msg}`);
          }

          convo.stop();
        });
      }
    });
  },
  haveArgumentHandler(controller, bot, message) {
    const _this = this;
    bot.startConversation(message, (err, argConversation) => {
      argConversation.ask(`ok you wanna start a ${vocabulary.getMikeDang()} beef with me? Say \`yes\` or \`no\``, (response, argQuestion) => {
        if (response.text === 'yes' || response.text === 'Yes') {
          _this.startArgument(bot, message);
        } else {
          bot.reply(message, "Aww damn, alright.. I'll get yah next time.");
        }

        argQuestion.stop();
      });
    });
  },

  startArgument(bot, message) {
    bot.startConversation(message, (err, argConversation) => {
      argConversation.ask(`ok ${vocabulary.getInsultName()} prepare to get insulted! if you've had enough just say \`stop\``, (response, mainArgConversation) => {
        if (response.text.toLowerCase() !== 'stop') {
          vocabulary.getMikeInsult((insult) => {
            bot.reply(message, `<@${message.user}> ${insult}`);
          });
        } else {
          bot.reply(message, "OK ok. I'm through with you.");

          mainArgConversation.stop();
        }
      });
    });
  },


};
