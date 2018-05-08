const _ = require('lodash');
const moment = require('moment');
const messageUtils = require('../helpers/messageUtils');
const vocabulary = require('../helpers/vocabulary');

module.exports = {

  getBirthDayMessages(controller, bot) {
    bot.api.users.list({
      presence: 0,
    }, (err, res) => {
      if (res.members) {
        _.forEach(res.members, (member) => {
          controller.storage.users.get(member.id, (err, userObj) => {
            if (userObj && userObj.birthday) {
              const birthdayDate = moment(userObj.birthday, 'MM/DD');
              const now = moment();

              if (now.isSame(birthdayDate, 'month') && now.isSame(birthdayDate, 'day')) {
                const birthdayMessage = vocabulary.getBirthdayGreeting(`<@${member.id}>`);

                messageUtils.postMessage(bot, ['general'], birthdayMessage);
              }
            }
          });
        });
        bot.botkit.log(`Found ${res.members.length} user accounts`);
      }
    });
  },
};
