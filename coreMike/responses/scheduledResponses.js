var cron = require('node-cron');
var dayOfTheWeekResponses = require('./dayOfTheWeek');

var scheduledResponses = function(bot) {

    cron.schedule('00 30 9 * * 1-5', function(){

        bot.api.chat.postMessage({'channel' : 'general', 'text' : 'Mornin Mornin!', 'as_user' : true}, function (err, res) {
          console.log(res);
        });

        bot.api.chat.postMessage({'channel' : 'general', 'text' : dayOfTheWeekResponses.statementResponse(), 'as_user' : true}, function (err, res) {
            console.log(res);
        });
    });

};

module.exports = scheduledResponses;