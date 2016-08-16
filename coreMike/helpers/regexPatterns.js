

// https://jsfiddle.net/yjajue8d/ -- quick test fiddle

var nameRegex =         new RegExp("call me (.*)|my name is (.*)", "i");

var whatsMyNameRegex =  new RegExp("whats my name(.*)|who am i(.*)|what\'s my name(.*)|what is my name(.*)", "i");

var whatDayRegex =      new RegExp("what day is it", "i");

var weatherRegex =      new RegExp("weather","i");

var timeRegex =         new RegExp("what time is it", "i");

var whoKilled =         new RegExp("who killed ", "i");

var kidsRegex =         new RegExp(":baby:|kids|children", "i");

var tacoRegex =         new RegExp(":taco:", "i");

var invalidNameRegex =  /@/;

var whereToEat =        new RegExp("(.*) I eat(.*)|(.*)for lunch(.*)|(.*)for food(.*)|lunch\?", "i");

module.exports = {

    getMyNameRegex: function () {
        return nameRegex;
    },
    getWhatsMyNameRegex: function () {
        return whatsMyNameRegex;
    },
    getWhatDayRegex: function () {
        return whatDayRegex;
    },
    getWeatherRegex: function () {
        return weatherRegex;
    },
    getTimeRegex: function () {
        return timeRegex;
    },
    getKidsRegex: function () {
        return kidsRegex;
    },
    getWhereToEatRegex: function () {
        return whereToEat;
    },
    getWhoKilledRegex: function () {
        return whoKilled;
    },
    getTacoRegex: function () {
        return tacoRegex;
    },
    getInvalidNameRegex: function () {
        return invalidNameRegex;
    }


};