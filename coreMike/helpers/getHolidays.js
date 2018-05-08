const moment = require('moment');
const _ = require('lodash');
const ics = require('ics-parser');
const fs = require('fs');
const path = require('path');

module.exports = {

  getHolidaysForYear(callback) {
    // sources http://www.calendarlabs.com/templates/ical/US-Holidays.ics
    // editor http://apps.marudot.com/ical/
    fs.readFile(path.join(__dirname, '../resources/US-Holidays.ics'), (err, data) => {
      if (err) {
        callback(null);
      } else {
        const events = ics(data.toString());
        callback(events);
      }
    });
  },
  getUpcomingHolidays(appCache) {
    const now = moment();
    const upcoming = [];
    let limit = 15;
    _.forEach(appCache.get('holidays'), (value, key) => {
      const holidayDate = moment(value.startDate);
      // if holiday is after current date
      if (holidayDate.isAfter(now) && value.name) {
        if (limit > 0) {
          upcoming.push(value);
        }
        limit -= 1;
      }
    });

    return upcoming;
  },
  checkIfCurrentDayIsHoliday(appCache, callback) {
    const now = moment();
    const formattedDateString = now.format('YYYY-MM-DD');
    let holidayFound = false;

    _.forEach(appCache.get('holidays'), (value, key) => {
      const holidayDate = moment(value.startDate);
      const formattedHolidayDate = holidayDate.format('YYYY-MM-DD');
      // if current date matches holiday date
      if (formattedDateString === formattedHolidayDate && value.name) {
        callback(value);
        holidayFound = true;
      }
    });

    if (!holidayFound) {
      callback(false);
    }
  },
};

