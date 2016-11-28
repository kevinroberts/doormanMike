var unirest = require('unirest');
var moment = require('moment');
var _ = require('lodash');
var ics = require('ics-parser');
var fs = require('fs');
var path = require('path');

module.exports = {

    getHolidaysForYear: function (callback) {
        // sources http://www.calendarlabs.com/templates/ical/US-Holidays.ics
        // editor http://apps.marudot.com/ical/
        fs.readFile(path.join(__dirname, '/files/US-Holidays.ics'), function(err, data) {
            if (err) {
                callback(null);
            } else {
                var events = ics(data.toString());
                callback(events);
            }
        });
    },
    getUpcomingHolidays: function (appCache) {
        var now = moment();
        var upcoming = [];

        _.forEach(appCache.get( "holidays" ), function(value, key) {
            var holidayDate = moment(value.startDate);
            // if holiday is after current date
            if (holidayDate.isAfter(now) && value.name) {
                upcoming.push(value);
            }
        });

        return upcoming;
    },
    checkIfCurrentDayIsHoliday: function (appCache, callback) {
        var now = moment();
        var formattedDateString = now.format('YYYY-MM-DD');
        var holidayFound = false;

        _.forEach(appCache.get( "holidays" ), function(value, key) {
            var holidayDate = moment(value.startDate);
            var formattedHolidayDate = holidayDate.format('YYYY-MM-DD');
            // if current date matches holiday date
            if (formattedDateString === formattedHolidayDate && value.name) {
                callback(value);
                holidayFound = true;
            }
        });

        if (!holidayFound) {
            callback(false);
        }
    }
};

