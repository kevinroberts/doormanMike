var _ = require('lodash');
var moment = require('moment');
var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');

module.exports = {

    getBirthDayMessages: function (controller, bot) {

        bot.api.users.list({
            presence: 0
        }, function(err, res) {
            if (res.members) {
                _.forEach(res.members, function(member) {
                    controller.storage.users.get(member.id, function(err, userObj) {
                        if (userObj && userObj.birthday) {
                            var birthdayDate = moment(userObj.birthday, "MM/DD");
                            var now = moment();

                            if (now.isSame(birthdayDate, 'month') && now.isSame(birthdayDate, 'day')) {

                                var birthdayMessage = vocabulary.getBirthdayGreeting("<@" + member.id + ">");

                                messageUtils.postMessage(bot, ['general'], birthdayMessage);
                            }
                        }
                    });
                });
                bot.botkit.log("Found " + res.members.length + " user accounts");
            }
        });

    }
};