var unirest = require('unirest');
var moment = require('moment');
var _ = require('lodash');

module.exports = {

    getHolidaysForYear: function (apiKey, year, callback) {
        unirest.get("https://holidayapi.com/v1/holidays?key=" + apiKey + '&country=US&year='+year)
            .end(function (result) {
                if (result && result.status == 200) {
                    if (result.body && result.body.holidays) {
                        callback(result.body.holidays);
                    } else {
                        console.log("could not get holidays for doorman mike: ", result.status);
                        callback(null)
                    }
                } else {
                    console.log("could not get holidays for doorman mike: ", result.status);
                    callback(null)
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

