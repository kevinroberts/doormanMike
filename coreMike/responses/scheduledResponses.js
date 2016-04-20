var CronJob = require('cron').CronJob;

var dayOfTheWeekResponses = require('./dayOfTheWeek');

var scheduledResponses = function(bot) {

    var job = new CronJob({
        cronTime: '00 10 10 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 10:10:00 AM. It does not run on Saturday
             * or Sunday.
             */
            bot.api.chat.postMessage({'channel' : 'general', 'text' : 'Mornin Mornin!', 'as_user' : true}, function (err, res) {
                console.log(res);
            });

            bot.api.chat.postMessage({'channel' : 'general', 'text' : dayOfTheWeekResponses.statementResponse(), 'as_user' : true}, function (err, res) {
                console.log(res);
            });
        },
        start: false,
        timeZone: 'America/Chicago'
    });
    job.start();

};

module.exports = scheduledResponses;