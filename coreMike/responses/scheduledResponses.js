var CronJob = require('cron').CronJob;

var dayOfTheWeekResponses = require('./dayOfTheWeek');
var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');

var timezoneEnv = process.env.TIMEZONE;
function getDefaultTz() {
    if (timezoneEnv == null) {
        return 'America/Chicago';
    } else {
        return timezoneEnv;
    }
}

var scheduledResponses = function(bot) {

    var dailyMorninJob = new CronJob({
        cronTime: '00 10 09 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 9:10:00 AM. It does not run on Saturday
             * or Sunday.
             */
            messageUtils.postMessage(bot, 'general', vocabulary.getMikeMornin() + '\n' + dayOfTheWeekResponses.statementResponse());

        },
        start: false,
        timeZone: getDefaultTz()
    });

    var dailyLunchJob = new CronJob({
        cronTime: '00 10 11 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 11:10:00 AM. It does not run on Saturday
             * or Sunday.
             */
            messageUtils.postMessage(bot, ['john-cena', 'general'], vocabulary.getLunchMike());
        },
        start: false,
        timeZone: getDefaultTz()
    });

    dailyMorninJob.start();
    dailyLunchJob.start();

};

module.exports = scheduledResponses;