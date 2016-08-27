var CronJob = require('cron').CronJob;

var dayOfTheWeekResponses = require('./dayOfTheWeek');
var messageUtils = require('../helpers/messageUtils');
var vocabulary = require('../helpers/vocabulary');
var birthday = require('../responses/birthdayResponses');
var fistTracker = require('../responses/fistTracker');

var timezoneEnv = process.env.TIMEZONE;
function getDefaultTz() {
    if (timezoneEnv == null) {
        return 'America/Chicago';
    } else {
        return timezoneEnv;
    }
}

var scheduledResponses = function(controller, bot) {

    var dailyResetJob = new CronJob({
        cronTime: '00 05 00 * * 1-7',
        onTick: function() {
            /*
             * Runs every day
             * at 5:00:00 AM.
             */
            fistTracker.resetFistsGiven(controller, bot);
        },
        start: false,
        timeZone: getDefaultTz()
    });

    var dailyMorninJob = new CronJob({
        cronTime: '00 10 09 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 9:10:00 AM. It does not run on Saturday
             * or Sunday.
             */
            messageUtils.postMessage(bot, 'general', vocabulary.getMikeMornin() + '\n' + dayOfTheWeekResponses.statementResponse());
            birthday.getBirthDayMessages(controller, bot);
        },
        start: false,
        timeZone: getDefaultTz()
    });

    var dailyLunchJob = new CronJob({
        cronTime: '00 00 11 * * 1-5',
        onTick: function() {
            /*
             * Runs every weekday (Monday through Friday)
             * at 11:00:00 AM. It does not run on Saturday
             * or Sunday.
             */
            messageUtils.postMessage(bot, ['general'], vocabulary.getLunchMike());
        },
        start: false,
        timeZone: getDefaultTz()
    });

    var beerFridayJob = new CronJob({
        cronTime: '00 10 15 * * 5',
        onTick: function() {
            /*
             * Runs every Friday
             * at 3 PM.
             */
            messageUtils.postMessage(bot, ['general'], vocabulary.getBeerFriday());
        },
        start: false,
        timeZone: getDefaultTz()
    });


    dailyMorninJob.start();
    //dailyLunchJob.start();
    beerFridayJob.start();
    dailyResetJob.start();

};

module.exports = scheduledResponses;