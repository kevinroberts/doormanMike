

// https://jsfiddle.net/yjajue8d/ -- quick test fiddle

const nameRegex = new RegExp('call me (.*)|my name is (.*)', 'i');

const whatsMyNameRegex = new RegExp('whats my name(.*)|who am i(.*)|what\'s my name(.*)|what is my name(.*)', 'i');

const whatDayRegex = new RegExp('what day is it', 'i');

const weatherRegex = new RegExp('weather', 'i');

const timeRegex = new RegExp('what time is it', 'i');

const whoKilled = new RegExp('who killed ', 'i');

const kidsRegex = new RegExp(':baby:|kids|children', 'i');

const tacoRegex = new RegExp(':taco:', 'i');

const invalidNameRegex = new RegExp('@|:', 'ig');

const whereToEat = new RegExp('(.*) I eat(.*)|(.*)for lunch(.*)|(.*)for food(.*)|lunch\\?', 'i');

module.exports = {

  getMyNameRegex() {
    return nameRegex;
  },
  getWhatsMyNameRegex() {
    return whatsMyNameRegex;
  },
  getWhatDayRegex() {
    return whatDayRegex;
  },
  getWeatherRegex() {
    return weatherRegex;
  },
  getTimeRegex() {
    return timeRegex;
  },
  getKidsRegex() {
    return kidsRegex;
  },
  getWhereToEatRegex() {
    return whereToEat;
  },
  getWhoKilledRegex() {
    return whoKilled;
  },
  getTacoRegex() {
    return tacoRegex;
  },
  getInvalidNameRegex() {
    return invalidNameRegex;
  },


};
