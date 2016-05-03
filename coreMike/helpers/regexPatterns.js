

// https://jsfiddle.net/yjajue8d/ -- quick test fiddle

var nameRegex =         new RegExp("call me (.*)|my name is (.*)", "i");

var braptRegex =        new RegExp("^braa(.*)t|brappt|brapt", "i");

var whatsMyNameRegex =  new RegExp("whats my name(.*)|who am i(.*)|what\'s my name(.*)|what is my name(.*)", "i");

var whatDayRegex =      new RegExp("what day is it", "i");

var weatherRegex =      new RegExp("weather","i");

var timeRegex =         new RegExp("what time is it", "i");

var whoKilled =         new RegExp("who killed ", "i");

var kidsRegex =         new RegExp(":baby:|kids|children", "i");

var whereToEat =        new RegExp("(.*) I eat(.*)|(.*)for lunch(.*)|(.*)for food(.*)|lunch\?", "i");

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
    getKidsRegex: function getKidsRegex() {
        return kidsRegex;
    },
    getWhereToEatRegex: function getWhereToEatRegex() {
        return whereToEat;
    },
    getWhoKilledRegex: function getWhoKilledRegex() {
        return whoKilled;
    },
    getBraptRegex: function getBraptRegex() {
        return braptRegex;
    }


};