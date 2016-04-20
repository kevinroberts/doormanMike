var CronJob = require('cron').CronJob;

var dayOfTheWeekResponses = require('./dayOfTheWeek');
var development = process.env.NODE_ENV !== 'production';

var scheduledResponses = function(bot) {

    var job = new CronJob({
        cronTime: '00 10 09 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 9:10:00 AM. It does not run on Saturday
             * or Sunday.
             */
            bot.api.chat.postMessage({'channel' : 'general', 'text' : 'Mornin Mornin!\n' + dayOfTheWeekResponses.statementResponse(), 'as_user' : true}, function (err, res) {
                if (development) {
                    console.log(res);
                }
            });

        },
        start: false,
        timeZone: 'America/Chicago'
    });
    job.start();

};

module.exports = scheduledResponses;