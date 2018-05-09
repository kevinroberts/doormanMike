const S = require('string');
const _ = require('lodash');

const development = process.env.NODE_ENV !== 'production';

module.exports = {

  postMessage(bot, channel, message) {
    // if you are posting to more than one channel at once
    if (channel instanceof Array) {
      for (let i = 0, len = channel.length; i < len; i += 1) {
        const curChannel = channel[i];
        const toPost = { channel: curChannel, text: message, as_user: true };
        bot.api.chat.postMessage(toPost, (err, res) => {
          if (err) {
            bot.botkit.log(err);
          }
          if (development) {
            bot.botkit.log(res);
          }
        });
      }
    } else {
      // post to a single channel
      bot.api.chat.postMessage({ channel, text: message, as_user: true }, (err, res) => {
        if (development) {
          bot.botkit.log(res);
        }
      });
    }
  },

  postReaction(bot, message, emojiName) {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: emojiName,
    }, (err, res) => {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(', err);
      }
      if (development) {
        bot.botkit.log(res);
      }
    });
  },

  postMikeFist(bot, message) {
    this.postReaction(bot, message, 'fist::skin-tone-5');
  },

  getUsernameFromController(controller, user, callback) {
    controller.storage.users.get(user, (err, userObj) => {
      if (userObj && userObj.name) {
        callback(userObj.name);
      } else {
        callback(`<@${user}>`);
      }
    });
  },

  getLinkFromUserId(userId) {
    return `<@${userId}>`;
  },

  getUsernameFromUserMessage(userMessage) {
    // username matching regex
    const myRegexp = new RegExp('@[a-zA-Z0-9_]{1,21}', 'g');
    const match = myRegexp.exec(userMessage);

    if (match && match.length > 0) {
      return S(match[0]).chompLeft('@').s;
    }
    return '';
  },

  multiSearchOr(text, searchWords) {
    // create a regular expression from searchwords using join and |. Add "gi".
    // Example: ["ANY", "UNATTENDED","HELLO"] becomes
    // "ANY|UNATTENDED|HELLO","gi"
    // | means OR. gi means GLOBALLY and CASEINSENSITIVE
    let regex = '';
    for (let i = 0; i < searchWords.length; i += 1) {
      regex += '\\b(';
      regex += searchWords[i];
      regex += ')\\b';
      if (i < searchWords.length - 1) {
        regex += '|';
      }
    }
    const searchExp = new RegExp(regex, 'gi');

    // regularExpression.test(string) returns true or false
    return (searchExp.test(text));
  },

  getUserIdByUserName(username, bot, callback) {
    bot.api.users.list({
      presence: 0,
    }, (err, res) => {
      if (res.members) {
        bot.botkit.log(`Found ${res.members.length} user accounts`);
        _.forEach(res.members, (member) => {
          if (member.name === username) {
            callback(member.id);
          }
        });
      }
    });
  },

  getUsers(bot, callback) {
    bot.api.users.list({
      presence: 0,
    }, (err, res) => {
      if (res.members) {
        callback(res.members);
      } else {
        callback(new Error('no members returned '), err);
      }
    });
  },

  formatUptime(uptime) {
    // if uptime is greater than one day
    if (uptime > 86400) {
      let days = Math.floor(uptime / 86400);
      let hours = Math.floor((uptime - (days * 86400)) / 3600);
      let minutes = Math.floor((uptime - ((hours * 3600) + (days * 86400))) / 60);
      let seconds = uptime - (days * 86400) - (hours * 3600) - (minutes * 60);

      if (days < 10) { days = `0${days}`; }
      if (hours < 10) { hours = `0${hours}`; }
      if (minutes < 10) { minutes = `0${minutes}`; }
      if (seconds < 10) { seconds = `0${seconds}`; }

      return `${days} days : ${hours} hrs : ${minutes} minutes : ${Math.round(seconds)} seconds`;
    }
    // else uptime is less than a day
    let hours = Math.floor(uptime / 3600);
    let minutes = Math.floor((uptime - (hours * 3600)) / 60);
    let seconds = uptime - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = `0${hours}`; }
    if (minutes < 10) { minutes = `0${minutes}`; }
    if (seconds < 10) { seconds = `0${seconds}`; }
    return `${hours} hrs : ${minutes} minutes : ${Math.round(seconds)} seconds`;
  },


};
