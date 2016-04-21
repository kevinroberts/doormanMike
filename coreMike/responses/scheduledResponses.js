var CronJob = require('cron').CronJob;

var dayOfTheWeekResponses = require('./dayOfTheWeek');
var messageUtils = require('../helpers/messageUtils');

var scheduledResponses = function(bot) {

    var job = new CronJob({
        cronTime: '00 10 09 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 9:10:00 AM. It does not run on Saturday
             * or Sunday.
             */
            messageUtils.postMessage(bot, 'general', 'Mornin Mornin!\n' + dayOfTheWeekResponses.statementResponse());

        },
        start: false,
        timeZone: 'America/Chicago'
    });
    job.start();

};

module.exports = scheduledResponses;