const { CronJob } = require('cron');

const dayOfTheWeekResponses = require('./dayOfTheWeek');
const messageUtils = require('../helpers/messageUtils');
const vocabulary = require('../helpers/vocabulary');
const holidays = require('../helpers/getHolidays');
const birthday = require('../responses/birthdayResponses');
const fistTracker = require('../responses/fistTracker');


const timezoneEnv = process.env.TIMEZONE;
function getDefaultTz() {
  if (timezoneEnv === null) {
    return 'America/Chicago';
  }
  return timezoneEnv;
}

const scheduledResponses = (controller, appCache, bot) => {
  const dailyResetJob = new CronJob({
    cronTime: '00 05 00 * * 1-7',
    onTick() {
      /*
             * Runs every day
             * at 5:00:00 AM.
             */
      fistTracker.resetFistsGiven(controller, bot);
    },
    start: false,
    timeZone: getDefaultTz(),
  });

  const dailyMorninJob = new CronJob({
    cronTime: '00 10 09 * * 1-5',
    onTick() {
      /*
             * Runs every weekday (Monday through Friday)
             * at 9:10:00 AM. It does not run on Saturday
             * or Sunday.
             */

      holidays.checkIfCurrentDayIsHoliday(appCache, (holidayFound) => {
        if (holidayFound) {
          messageUtils.postMessage(bot, 'general', vocabulary.getMikeMornin());

          messageUtils.postMessage(bot, 'general', `Happy ${vocabulary.getMikeDang()} ${holidayFound.name}!`);
        } else {
          messageUtils.postMessage(bot, 'general', `${vocabulary.getMikeMornin()}\n${dayOfTheWeekResponses.statementResponse()}`);
        }
      });
    },
    start: false,
    timeZone: getDefaultTz(),
  });

  const dailyBirthday = new CronJob({
    cronTime: '00 09 09 * * 1-7',
    onTick() {
      // Runs every day (Monday through Sun) at 9:09:00 AM.
      birthday.getBirthDayMessages(controller, bot);
    },
    start: false,
    timeZone: getDefaultTz(),
  });

  // const dailyLunchJob = new CronJob({
  //   cronTime: '00 00 11 * * 1-5',
  //   onTick() {
  //     /*
  //            * Runs every weekday (Monday through Friday)
  //            * at 11:00:00 AM. It does not run on Saturday
  //            * or Sunday.
  //            */
  //     messageUtils.postMessage(bot, ['general'], vocabulary.getLunchMike());
  //   },
  //   start: false,
  //   timeZone: getDefaultTz(),
  // });

  const beerFridayJob = new CronJob({
    cronTime: '00 10 15 * * 5',
    onTick() {
      /*
             * Runs every Friday
             * at 3 PM.
             */
      holidays.checkIfCurrentDayIsHoliday(appCache, (holidaysFound) => {
        if (holidaysFound) {
          messageUtils.postMessage(bot, ['general'], vocabulary.getBeerFriday());
          messageUtils.postMessage(bot, ['general'], `Go celebrate ${vocabulary.getMikeDang()} ${holidaysFound.name}! `);
        } else {
          messageUtils.postMessage(bot, ['general'], vocabulary.getBeerFriday());
        }
      });
    },
    start: false,
    timeZone: getDefaultTz(),
  });


  dailyMorninJob.start();
  // dailyLunchJob.start();
  beerFridayJob.start();
  dailyResetJob.start();
  dailyBirthday.start();
};

module.exports = scheduledResponses;
