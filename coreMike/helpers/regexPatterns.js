

var nameRegex =         new RegExp("call me (.*)|my name is (.*)", "i");

var whatsMyNameRegex =  new RegExp("whats my name(.*)|who am i(.*)|what\'s my name(.*)", "i");

var whatDayRegex =      new RegExp("what day is it", "i");

var weatherRegex =      new RegExp("weather","i");

var timeRegex =         new RegExp("what time is it", "i");

var whoKilled =         new RegExp("who killed ", "i");

module.exports = {

    getMyNameRegex: function getMyNameRegex() {
        return nameRegex;
    },
    getWhatsMyNameRegex: function getWhatsMyNameRegex() {
        return whatsMyNameRegex;
    },
    getWhatDayRegex: function getWhatDayRegex() {
        return whatDayRegex;
    },
    getWeatherRegex: function getWeatherRegex() {
        return weatherRegex;
    },
    getTimeRegex: function getTimeRegex() {
        return timeRegex;
    },
    getWhoKilledRegex: function getWhoKilledRegex() {
        return whoKilled;
    }


}