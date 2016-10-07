var unirest = require('unirest');
var moment = require('moment');
var _ = require('lodash');
var ics = require('ics-parser');
var fs = require('fs');
var path = require('path');

module.exports = {

    getHolidaysForYear: function (callback) {
        fs.readFile(path.join(__dirname, '/files/US-Holidays.ics'), function(err, data) {
            if (err) {
                callback(null);
            } else {
                var events = ics(data.toString());
                callback(events);
            }
        });
    },
    checkIfCurrentDayIsHoliday: function (appCache, callback) {
        var now = moment();
        var formattedDateString = now.format('YYYY-MM-DD');
        var holidayFound = false;

        _.forEach(appCache.get( "holidays" ), function(value, key) {
            // if passed name contains a crush
            if (formattedDateString == key) {
                callback(value);
                holidayFound = true;
            }
        });

        if (!holidayFound) {
            callback(false);
        }
    }
};

