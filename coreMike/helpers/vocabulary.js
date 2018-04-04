var love = require('../responses/loveMachine');
var _ = require('lodash');
var complimentStore = require('../resources/compliments.json');
var insultStore = require('../resources/insults.json');

var timesheetResponse = 'and finish that timesheet https://webet.icfi.com/DeltekTC/welcome.msv';

var mikeDangs = [
  'gawd damn',
  'gaddd dannng',
  'gad damn',
  'gaahd doggity damn',
  'gotdanng',
  'gahdamn',
  'gotdamn',
  'gaddanng',
  'goddamn'
];

var mikeMornin = [
  "Mornin Mornin!",
  'MOOORNIN MOORNIN!!!1',
  'SOMEONE JUST OPENED A FRESH CAN OF BRAAPPT! IT\'s OFFICIALLY A MORNIN MORNIN!',
  '\'Mornin \'Mornin',
  'Buenos DANG días días! :flag-mx:',
  'Morning Morning!!!'
];

var mikeHellos = [
  'Hey |USERNAME|! what\'s up?!',
  'What\'s cookin |USERNAME|?!',
  'whats up |USERNAME|!!!',
  'Yo |USERNAME|!',
  'Hey |USERNAME|!'
];

var insultNames = [
  'assface',
  'bitch',
  'motha fucka',
  'numbnuts'
];

var beerFriday = [
  'It\'s gahdamn :beer: FRIDAY time! Grabs yo self a brew! \n' + timesheetResponse,
  'It\'s gahdamn :beer: FRIDAY time! Grabs yo self a brew! I bet Tyler has got a dope ass movie playin!\n' + timesheetResponse,
  'It\'s gahdamn :beer: FRIDAY time! Grabs yo self a brew! AND yo JMOLSEN its time to getttt crunk! \n' + timesheetResponse,
  ':fist::skin-tone-5: SOMEONE SAY GGAAAAAHDAMN BEER FRIDAY TIME!!!!!1@? CUZ IT IS, GRAB YOURSELF A BEER :beers: :fist::skin-tone-5: \n' + timesheetResponse,
  'BRAAAPT! its :beer: Friday time! grabs yo self a beer! :fist::skin-tone-5:\n' + timesheetResponse
];

var sadMikes = [
  ':thumbsdown::skin-tone-5:',
  ':rage:',
  ':sob:'
];

var profaneResponse = [
  'woah. Language, bruh.',
  'daayuum you speak to your mother with that mouth?',
  'watch yo language',
  'dont get me into trouble, watch your language :fist::skin-tone-5:'
];

var lunchIntro = [
  '\'bout lunch o\'clock',
  'nearin lunch time!',
  'LUNCH!!!',
  'nearin lunch o\'clock!',
  'almost lunch!'
];

var brapts = [
  '|USERNAME| u stink dude :frog: ',
  '|USERNAME| sick - that sounded wet',
  '|USERNAME| sometimes you gamble and lose :game_die: '
];

var brapts2 = [
  'DAAAYUUM HEAVY LOAD TODAY??',
  'GAAAHDAMMN THAT WAS AN EPIC ONE',
  'I could hear that one from all the way downstairs yo!',
  'DAYUMMM WHO LET YOU GOT FRESH AND FRUITY ROOTY TOOTY THERE!!1!'
];

var bodies = [
  'in |USERNAME|\'s basement of course!',
  'I forget but my basement is full',
  'oh |USERNAME| you know... in a van down by the river..',
  'I didn\'t do it |USERNAME|!'
];

var birthday = [
  'YO EVERYONE TODAY IS |USERNAME| |DANG| BIRTHDAY! :birthday: :fist::skin-tone-5:'
];

var lunchDestinations = [
  'La Cocina :flag-mx: :burrito: :flag-mx:',
  'Tommy\'s Place -> https://goo.gl/maps/m2hR5yT8gS52',
  'Blackwoods BBQ :meat_on_bone: -> https://goo.gl/maps/7BaCbKpUbLn',
  'Goodwins sandwiches :bread: -> https://goo.gl/maps/uxqAZJG1AYH2',
  'UB DOGS :hamburger: :hotdog: -> :hamburger: https://goo.gl/maps/orVEFT9PMJz',
  'Naf Naf :camel: -> https://goo.gl/maps/JsXP5QABoPu',
  'Epic burger :hamburger: -> https://goo.gl/maps/n7yso4M6W2T2',
  'Jersey Mikes sandwiches -> https://goo.gl/maps/TzAPwC5ZDWx',
  'Cafecito :flag-cu: -> https://goo.gl/maps/PrWAYBd34bz',
  'Pierogi Heaven :flag-pl: -> https://goo.gl/maps/tJU8rTF1jKo',
  'Halsted Street Deli -> https://goo.gl/maps/kxEk9BCnV9F2',
  'Baccis Pizza -> https://goo.gl/maps/1Ed4fu2rqcM2',
  'Taza for some Mediterranean -> https://goo.gl/maps/NCUk1w3E2am',
  'boring :sleeping: Caffe Baci -> https://goo.gl/maps/wiCXCFehbq72',
  'Specialty\'s bakery :bread: -> https://goo.gl/maps/XvJmgaGH9852',
  'Costa Vida for some Baja-style :burrito:\'s -> https://goo.gl/maps/L1MtEmRdeYE2',
  'Mixed Greens :leaves: -> https://goo.gl/maps/LkRp5Lq46UJ2'
];

var lunchMikes = [
  '|INTRO| I don\'t know about you guy\'s but i\'m cravin some |DESTINATION| :fist::skin-tone-5:',
  '|INTRO| might I suggest you go to |DESTINATION|!?',
  '|INTRO| why don\'t you all take a trip to the |DANG| |DESTINATION|? ',
  '|INTRO| might I suggest some |DANG| |DESTINATION|!?',
  '|INTRO| You guys getting dat GROUP DISCOUNT!? Go to |DESTINATION| for a change! :fist::skin-tone-5:'
];

var kidsReponses = [
  'I don\'t run a |DANG| day care here keep dem kids away! :fist::skin-tone-5:',
  '|DANG| kids, keep em away from me',
  'I\'m |DANG| outta here if you\'re bringing kids around here'

];

var wasters = [
  "hm...",
  "well",
  "with a little bit of lemon and mint.",
  "interesting..."
];

module.exports = {
  getMikeCompliment: function () {
    return _.sample(complimentStore.compliments);
  },
  getMikeInsult: function () {
    var insult = _.sample(insultStore.insults);
    insult = insult.replace("|MIKE_DANG|", _.sample(mikeDangs));
    return insult;
  },
  getMikeInsultLowercase: function () {
    var insult = _.sample(insultStore.insults);
    insult = insult.replace("|MIKE_DANG|", _.sample(mikeDangs));
    // lower case first letter
    insult = insult.charAt(0).toLowerCase() + insult.slice(1);
    return insult;
  },
  getMikeDang: function () {
    return _.sample(mikeDangs);
  },
  getMikeMornin: function () {
    return _.sample(mikeMornin);
  },
  getWaster: function () {
    return _.sample(wasters);
  },
  getLunchMike: function () {
    var myDate = new Date();
    var msg = _.sample(lunchMikes).replace("|DANG|", _.sample(mikeDangs));
    msg = msg.replace("|DESTINATION|", _.sample(lunchDestinations));
    msg = msg.replace("|INTRO|", _.sample(lunchIntro));

    // if the hour is between 5 and 10 am Mike is in breakfast mode
    // if (myDate.getHours() > 5 && myDate.getHours() <= 10) {
    //   return "it's " + _.sample(mikeDangs) + " breakfast time. Go to dunkin dohnuts or make yourself a bagel."
    // }
    if (myDate.getHours() > 5 && myDate.getHours() <= 15) {
      return msg;
    }/* Hour is past 3pm is like totes Dinner time for Mike*/
    else if (myDate.getHours() >= 15) {
      return "it's " + _.sample(mikeDangs) + " past lunch time. Go to monks pub or make yourself some dinner.";
    }

  },
  getLunchDestination: function () {
    return _.sample(lunchDestinations);
  },
  getSadMikeReaction: function () {
    return _.sample(sadMikes);
  },
  getMikeHello: function () {
    return _.sample(mikeHellos).replace(" |USERNAME|", "");
  },
  getBrapt: function (name) {
    return _.sample(brapts).replace("|USERNAME|", name);
  },
  getBraptPt2: function () {
    return _.sample(brapts2);
  },
  getProfaneReponse: function () {
    return _.sample(profaneResponse);
  },
  getBodies: function (name) {
    return _.sample(bodies).replace("|USERNAME|", name);
  },
  getInsultName: function () {
    return _.sample(insultNames);
  },
  getBeerFriday: function () {
    return _.sample(beerFriday);
  },
  getKidsReponse: function () {
    return _.sample(kidsReponses).replace("|DANG|", _.sample(mikeDangs));
  },
  getBirthdayGreeting: function (name) {
    var birthdayMsg = _.sample(birthday).replace("|USERNAME|", name);
    birthdayMsg = birthdayMsg.replace("|DANG|", _.sample(mikeDangs).toUpperCase());
    return birthdayMsg;
  },
  getPersonalMikeHello: function (name) {
    var personalHelloMsg = _.sample(mikeHellos).replace("|USERNAME|", name);
    personalHelloMsg += love.getLoveReactionForName(name);
    return personalHelloMsg;
  }
};