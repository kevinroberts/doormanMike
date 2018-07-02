/*
 *   defines all the basic mike responses
 */
const os = require('os');
const S = require('string');
const _ = require('lodash');
const matcher = require('matcher');
const moment = require('moment');
const Chance = require('chance');
const dayOfTheWeekResponses = require('./dayOfTheWeek');
const messageUtils = require('../helpers/messageUtils');
const vocabulary = require('../helpers/vocabulary');
const love = require('../responses/loveMachine');
const weather = require('../responses/weatherResponses');
const conversations = require('../responses/conversations');
const facts = require('../responses/mikeFacts');
const patterns = require('../helpers/regexPatterns');
const fistTracker = require('../responses/fistTracker');
const complimentInsult = require('../responses/complimentsAndInsults');
const holidays = require('../helpers/getHolidays');
const urbandictionary = require('../helpers/urbandictionary');
const dictionary = require('../helpers/wordDictionary');
const trumpism = require('../helpers/getTrumpism');
const constants = require('../slackConstants');
const CleverbotImpl = require('../helpers/cleverbot');

const chance = new Chance();


const baseResponses = (controller, appCache) => {
  // when joins a channel
  controller.on('bot_channel_join', (bot, message) => {
    bot.reply(message, 'Mike is here! :fist::skin-tone-5: Someone order some lemon and mint?');
  });

  controller.on('user_channel_join', (bot, message) => {
    messageUtils.postMikeFist(bot, message);
    const intro = `Welcome <@${message.user}>! May I be the first to welcome you to the <#${message.channel}> channel.`;
    bot.reply(message, intro);
  });

  // ambient responses [use sparingly]
  controller.hears('', 'ambient', (bot, message) => {
    const usersMessage = message.text;

    if (matcher.isMatch(usersMessage, 'mornin mornin') || matcher.isMatch(usersMessage, 'good morning*') || matcher.isMatch(usersMessage, 'morning')) {
      if (chance.bool({ likelihood: 30 })) {
        bot.startTyping(message);
        messageUtils.getUsernameFromController(controller, message.user, (name) => {
          bot.reply(message, `${name} ${dayOfTheWeekResponses.getMikeMorninTimeSensitive(null)}${love.getLoveReactionForName(name)}`);
        });
      }
    } else if (matcher.isMatch(usersMessage, '*doorman-mike*')) {
      messageUtils.postMikeFist(bot, message);
      const responseMsg = `<@${message.user}> what's up?`;
      bot.reply(message, responseMsg);
    } else if (matcher.isMatch(usersMessage, '*:fist:*')) {
      fistTracker.handleFistMessage(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, 'who* champ*') || matcher.isMatch(usersMessage, 'who is champ*')) {
      messageUtils.postReaction(bot, message, 'cena');
    } else if (matcher.isMatch(usersMessage, 'clear')) {
      messageUtils.postReaction(bot, message, 'zap');
      messageUtils.postReaction(bot, message, 'hearts');
      messageUtils.postReaction(bot, message, 'ambulance');
      messageUtils.postMessage(bot, message.channel, '\n ------ clearing ------- \n');
      messageUtils.postMessage(bot, message.channel, '-\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n-');
      messageUtils.postMessage(bot, message.channel, '-\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n-');
      messageUtils.postMessage(bot, message.channel, '-\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n-');
      messageUtils.postMessage(bot, message.channel, '-\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n-');
      messageUtils.postMessage(bot, message.channel, '-\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n-');
    }
  });


  /*
   *    Catch all other responses that are not defined and pass it through our mike logic
   */
  controller.hears('', 'direct_message,direct_mention,mention', (bot, message) => {
    // start mike typing - some responses take longer than others
    bot.startTyping(message);

    // checking the message.event: message.event == 'direct_message'
    const usersMessage = message.text;

    // respond to weather related queries
    if (usersMessage.search(patterns.getWeatherRegex()) !== -1) {
      weather.getWeatherResponse(controller, message.user, (msg) => {
        bot.reply(message, msg);
      });
      // user asks what day is it?
    } else if (usersMessage.search(patterns.getWhatDayRegex()) !== -1) {
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        bot.reply(message, dayOfTheWeekResponses.questionResponse(name, bot, message));
      });
      // user asks what time is it?
    } else if (usersMessage.search(patterns.getTimeRegex()) !== -1) {
      messageUtils.postReaction(bot, message, 'timer_clock');

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const msg = `it's time to get a ${vocabulary.getMikeDang()} watch!`;
        const loveMsg = love.getLoveReactionForName(name);
        bot.reply(message, `${name} ${msg}${loveMsg}`);
      });
    } else if (usersMessage.search(patterns.getTacoRegex()) !== -1) {
      messageUtils.postMikeFist(bot, message);
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const msg = `thanks for the ${vocabulary.getMikeDang()} taco bro!`;
        bot.reply(message, `${name} ${msg}`);
      });
    } else if (usersMessage.search(patterns.getMyNameRegex()) !== -1) {
      conversations.callMeHandler(appCache, controller, bot, message);
    } else if (usersMessage.search(patterns.getWhoKilledRegex()) !== -1) {
      messageUtils.postReaction(bot, message, 'knife');

      bot.reply(message, `I did! And it's NONE OF YOUR ${vocabulary.getMikeDang().toUpperCase()} BUSINESS `);
    } else if (usersMessage.search(patterns.getWhereToEatRegex()) !== -1) {
      messageUtils.postReaction(bot, message, 'fork_and_knife');
      const lunchSuggestion = vocabulary.getLunchMike();
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const loveMessage = love.getLoveReactionForName(name);
        bot.reply(message, `${name} ${lunchSuggestion}${loveMessage}`);
      });
    } else if (matcher.isMatch(usersMessage, '*upcoming holiday*') || matcher.isMatch(usersMessage, '*holidays*')) {
      let msg;

      const upcomingHolidays = holidays.getUpcomingHolidays(appCache);

      if (upcomingHolidays.length > 0) {
        msg = `I know of ${upcomingHolidays.length} ${vocabulary.getMikeDang()} holidays coming up: `;

        _.forEach(upcomingHolidays, (holiday) => {
          const holidayDate = moment(holiday.startDate).format('dddd, MMMM Do YYYY');
          msg += `\n${holiday.name} on ${holidayDate}`;
        });
      } else {
        msg = "I don't know of any upcoming holidays.";
      }

      bot.reply(message, msg);
    } else if (matcher.isMatch(usersMessage, '*holiday*')) {
      holidays.checkIfCurrentDayIsHoliday(appCache, (holidaysFound) => {
        if (holidaysFound) {
          let msg = `Yes, today is a holiday for ${vocabulary.getMikeDang()} `;
          msg += holidaysFound.name;
          bot.reply(message, msg);
        } else {
          bot.reply(message, "No, there's not a recognized holiday going on today. That I know of...");
        }
      });
    } else if (matcher.isMatch(usersMessage, 'define *')) {
      const word = usersMessage.split('define ')[1];
      urbandictionary.postFormattedDefinition(bot, message, word, (definition) => {
        if (!definition) {
          dictionary.getDefinition(word, (wordDef) => {
            if (wordDef) {
              bot.reply(message, wordDef);
            } else {
              bot.reply(message, 'Go look it up yourself! I have no idea.');
            }
          });
        }
      });
    } else if (matcher.isMatch(usersMessage, ':nerd_face: define *')) {
      const word = usersMessage.split(':nerd_face: define ')[1];
      dictionary.getDefinition(word, (definition) => {
        if (definition) {
          bot.reply(message, definition);
        } else {
          const nonRust = S(word).replaceAll('rusty ', '').s;
          bot.reply(message, `Go look it up yourself! I have no idea. Did you try the rusty version? \`define rusty ${nonRust}\``);
        }
      });
    } else if (matcher.isMatch(usersMessage, ':nerd_face: *')) {
      const wordToDefine = usersMessage.split(':nerd_face: ')[1];
      dictionary.getDefinition(wordToDefine, (definition) => {
        if (definition) {
          bot.reply(message, definition);
        } else {
          const nonRust = S(wordToDefine).replaceAll('rusty ', '').s;
          bot.reply(message, `Go look it up yourself! I have no idea. Did you try the rusty version? \`define rusty ${nonRust}\``);
        }
      });
    } else if (matcher.isMatch(usersMessage, 'send mornin to*')) {
      conversations.sendMorninToHandler(bot, message);
    } else if (matcher.isMatch(usersMessage, 'send insult to*')) {
      complimentInsult.sendInsultToHandler(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, 'send compliment to*')) {
      complimentInsult.sendComplimentHandler(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, '*been naughty*') || matcher.isMatch(usersMessage, '*naughty list*')) {
      complimentInsult.handleInsultLeaderBoardMessage(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, '*been nice*') || matcher.isMatch(usersMessage, '*nice list*')) {
      complimentInsult.handleComplimentLeaderBoardMessage(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, 'my birthday is*')) {
      conversations.setMyBirthdayHandler(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, '* fact*') || matcher.isMatch(usersMessage, 'fact*')) {
      facts.getMikeFact(bot, message);
    } else if (matcher.isMatch(usersMessage, 'when is * birthday*') || matcher.isMatch(usersMessage, 'when* * birthday*') || matcher.isMatch(usersMessage, 'what* * birthday*')) {
      conversations.getMyBirthdayHandler(controller, bot, message);
    } else if (usersMessage.search(patterns.getWhatsMyNameRegex()) !== -1) {
      conversations.setNameHandler(appCache, controller, bot, message);
    } else if (matcher.isMatch(usersMessage, '*argument*') || matcher.isMatch(usersMessage, '*argue*')) {
      conversations.haveArgumentHandler(controller, bot, message);
    } else if (matcher.isMatch(usersMessage, 'mornin* mornin*') || matcher.isMatch(usersMessage, 'good mornin*') || matcher.isMatch(usersMessage, 'mornin*')) {
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        bot.reply(message, dayOfTheWeekResponses.getMikeMorninTimeSensitive(name));
      });
    } else if (matcher.isMatch(usersMessage, 'where did you * bod*') || matcher.isMatch(usersMessage, 'what did you * bod*')) {
      if (chance.bool({ likelihood: 30 })) {
        messageUtils.postReaction(bot, message, 'knife');
      }

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        bot.reply(message, vocabulary.getBodies(name));
      });
    } else if (usersMessage.toLowerCase() === 'fart' || usersMessage.toLowerCase() === 'poop') {
      bot.reply(message, vocabulary.getMikeFart());
    } else if (matcher.isMatch(usersMessage, 'uptime') || matcher.isMatch(usersMessage, 'identify yourself') ||
      matcher.isMatch(usersMessage, 'who are you') || matcher.isMatch(usersMessage, 'what is your name*')) {
      messageUtils.postMikeFist(bot, message);

      const hostname = os.hostname();
      const uptime = messageUtils.formatUptime(process.uptime());

      bot.reply(message, `:doorman: I am a bot named <@${bot.identity.name}>. I have been alive for ${uptime} on NONE OF YO GODANG BUSINESS SERVER. (${hostname}).\nIf you want to know more: \`@${constants.getBotUsername()} help\``);
    } else if (usersMessage.toLowerCase() === 'hey' || usersMessage.indexOf('hows it going') > -1 || usersMessage.toLowerCase() === 'whats good' || usersMessage.toLowerCase() === 'whats up') {
      const msgPt2 = dayOfTheWeekResponses.statementResponse();

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const personalHello = vocabulary.getPersonalMikeHello(name).toUpperCase();
        bot.reply(message, `${personalHello} ${msgPt2}`);
      });
    } else if (usersMessage.toLowerCase() === 'hi' || usersMessage.toLowerCase() === 'hello') {
      messageUtils.postMikeFist(bot, message);

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        bot.reply(message, vocabulary.getPersonalMikeHello(name));
      });
    } else if (matcher.isMatch(usersMessage, 'braa*t*') || matcher.isMatch(usersMessage, 'br*pt') || matcher.isMatch(usersMessage, 'diarrhea*') || matcher.isMatch(usersMessage, 'shart*') || matcher.isMatch(usersMessage, 'shits*')) {
      messageUtils.postReaction(bot, message, 'poop');
      const numberOfAs = S(usersMessage.toLowerCase()).count('a');

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        let bMsg = vocabulary.getBrapt(name);
        if (numberOfAs > 10) {
          bMsg += `\n${vocabulary.getBraptPt2()}`;
        }
        bot.reply(message, bMsg);
      });
    } else if (matcher.isMatch(usersMessage, '*favorite day*') || matcher.isMatch(usersMessage, 'what is * day *') || matcher.isMatch(usersMessage, 'what day * fav*')) {
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const bMsg = dayOfTheWeekResponses.favoriteDayResponse(name);

        bot.reply(message, bMsg);
      });
    } else if (matcher.isMatch(usersMessage, '*Monday*') || matcher.isMatch(usersMessage, '*monday*')) {
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const bMsg = dayOfTheWeekResponses.getMikeMondayResponse(name, bot, message);

        bot.reply(message, bMsg);
      });
    } else if (matcher.isMatch(usersMessage, '*Friday*') || matcher.isMatch(usersMessage, '*friday*')) {
      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        const bMsg = dayOfTheWeekResponses.getMikeFridayResponse(name, bot, message);

        bot.reply(message, bMsg);
      });
    } else if (matcher.isMatch(usersMessage, 'are you really*')) {
      let name = usersMessage.split('are you really ')[1];
      name = S(name).stripPunctuation().s;

      bot.reply(message, `No, what dumbass calls themselves ${name}?`);
    } else if (matcher.isMatch(usersMessage, '*weekend*')) {
      bot.reply(message, dayOfTheWeekResponses.getMikeWeekendResponse());
    } else if (matcher.isMatch(usersMessage.toLowerCase(), 'trump') || matcher.isMatch(usersMessage.toLowerCase(), 'what would trump say')) {
      const mikeReactions = [
        'As Trump would say, ',
        ':trump: ',
        'From the man himself ',
      ];

      // trumpisms
      trumpism.getRandomTrump((quote) => {
        bot.reply(message, _.sample(mikeReactions) + quote);
      });
    } else if (usersMessage.toLowerCase() === 'mike' || usersMessage.toLowerCase() === 'doorman') {
      messageUtils.postMikeFist(bot, message);

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        bot.reply(message, `Yes, ${name} that's my name.`);
      });
    } else if (matcher.isMatch(usersMessage, '*:fist:*')) {
      messageUtils.postMikeFist(bot, message);

      messageUtils.getUsernameFromController(controller, message.user, (name) => {
        bot.reply(message, `${name} thanks for the ${vocabulary.getMikeDang()} fist bro.\nCheck out the leaderboard \`@${constants.getBotUsername()} leaderboard\``);
      });

      fistTracker.handleBotFist(controller, bot, message);
    } else if (usersMessage.toLowerCase() === 'leaderboard') {
      fistTracker.handleLeaderBoardMessage(controller, bot, message);
    } else if (usersMessage.toLowerCase() === 'help') {
      controller.storage.users.get(constants.getBotUserID(), (err, userObj) => {
        if (userObj && userObj.helpText) {
          bot.reply(message, userObj.helpText);
        } else {
          bot.reply(message, 'no help for you');
        }
      });
    } else {
      // catch all other responses
      const profane = appCache.get('profane');
      const result = { found: false, curse: '' };

      _.forEach(_.words(usersMessage), (word) => {
        if (messageUtils.multiSearchOr(word, profane.profaneList)) {
          result.found = true;
          result.curse = word;
        }
      });
      if (messageUtils.multiSearchOr(usersMessage, profane.profaneList)) {
        // console.log('heard profanity: ', result.curse);
        // give them a :disapproval:
        messageUtils.postReaction(bot, message, 'disapproval');
        // messageUtils.getUsernameFromController(controller, message.user, (name) => {
        //   let msg = `${name} ${vocabulary.getProfaneReponse()}`;
        //   if (message.user === constants.getAdminUserID()) {
        //     msg += ` (you said ${result.curse})`;
        //   }
        //   bot.reply(message, msg);
        // });
      }
      if (usersMessage.search(patterns.getKidsRegex()) !== -1 && chance
        .bool({likelihood: 50})) {
        messageUtils.postReaction(bot, message, 'scream');

        bot.reply(message, vocabulary.getKidsReponse());
      }
      // initialize cleverbot module with a clerverbot instance
      // ask clever bot for a response (cleverbot.io)
      CleverbotImpl.getCleverBotResponse(message, (response) => {
        let returnMsg = response;
        if (chance.bool({ likelihood: 80 }) && result.curse) {
          if (returnMsg.endsWith('.')) {
            returnMsg = returnMsg.slice(0, -1);
          } else if (returnMsg.endsWith('?')) {
            returnMsg = returnMsg.slice(0, -1);
          }
          if (result.curse === 'ass') {
            returnMsg += `, my ${result.curse}.`;
          } else {
            returnMsg += `, ${result.curse}.`;
          }
        }
        bot.reply(message, returnMsg);
      });
    }
  });
};


module.exports = baseResponses;
