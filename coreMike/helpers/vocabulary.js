const love = require('../responses/loveMachine');
const _ = require('lodash');
const complimentStore = require('../resources/compliments.json');
const constants = require('../slackConstants');
const lunchStore = require('../resources/lunchOptions.json');
const insultStore = require('../resources/insults.json');


const timesheetResponse = 'and if your work requires you to fill out a timesheet, you should fill that shiz in';

const mikeDangs = [
  'gawd damn',
  'gaddd dannng',
  'gad damn',
  'gaahd doggity damn',
  'gotdanng',
  'gahdamn',
  'gotdamn',
  'gaddanng',
  'goddamn',
];

const mikeMornin = [
  'Mornin Mornin!',
  'MOOORNIN MOORNIN!!!1',
  'SOMEONE JUST OPENED A FRESH CAN OF BRAAPPT! IT\'s OFFICIALLY A MORNIN MORNIN!',
  '\'Mornin \'Mornin',
  'Buenos DANG días días! :flag-mx:',
  'Morning Morning!!!',
];

const mikeHellos = [
  'Hey |USERNAME|! what\'s up?!',
  'What\'s cookin |USERNAME|?!',
  'whats up |USERNAME|!!!',
  'Yo |USERNAME|!',
  'Hey |USERNAME|!',
];

const insultNames = [
  'assface',
  'bitch',
  'motha fucka',
  'numbnuts',
];

const beerFriday = [
  `It's gahdamn :beer: FRIDAY time! Grabs yo self a brew! \n${timesheetResponse}`,
  `It's gahdamn :beer: FRIDAY time! Grabs yo self a brew! I bet Jake has drunk 10 :malort: shots already!\n${timesheetResponse}`,
  `It's gahdamn :beer: FRIDAY time! Grabs yo self a brew! AND yo JMOLSEN its time to getttt crunk! \n${timesheetResponse}`,
  `:fist::skin-tone-5: SOMEONE SAY GGAAAAAHDAMN BEER FRIDAY TIME!!!!!1@? CUZ IT IS, GRAB YOURSELF A BEER :beers: :fist::skin-tone-5: \n${timesheetResponse}`,
  `BRAAAPT! its :beer: Friday time! grabs yo self a beer! :fist::skin-tone-5:\n${timesheetResponse}`,
];

const sadMikes = [
  ':thumbsdown::skin-tone-5:',
  ':rage:',
  ':sob:',
];

const profaneResponse = [
  'woah. Language, bruh.',
  'daayuum you speak to your mother with that mouth?',
  'watch yo language',
  'dont get me into trouble, watch your language :fist::skin-tone-5:',
];

const lunchIntro = [
  '\'bout lunch o\'clock',
  'nearin lunch time!',
  'LUNCH!!!',
  'nearin lunch o\'clock!',
  'almost lunch!',
];

const brapts = [
  '|USERNAME| u stink dude :frog: ',
  '|USERNAME| sick - that sounded wet',
  '|USERNAME| sometimes you gamble and lose :game_die: ',
];

const brapts2 = [
  'DAAAYUUM HEAVY LOAD TODAY??',
  'GAAAHDAMMN THAT WAS AN EPIC ONE',
  'I could hear that one from all the way downstairs yo!',
  'DAYUMMM WHO LET YOU GOT FRESH AND FRUITY ROOTY TOOTY THERE!!1!',
];

const bodies = [
  'in |USERNAME|\'s basement of course!',
  'I forget but my basement is full',
  'oh |USERNAME| you know... in a van down by the river..',
  'I didn\'t do it |USERNAME|!',
];

const birthday = [
  'YO EVERYONE TODAY IS |USERNAME| |DANG| BIRTHDAY! :birthday: :fist::skin-tone-5:',
];

const lunchMikes = [
  '|INTRO| I don\'t know about you guy\'s but i\'m cravin some |DESTINATION| :fist::skin-tone-5:',
  '|INTRO| might I suggest you go to |DESTINATION|!?',
  '|INTRO| why don\'t you all take a trip to the |DANG| |DESTINATION|? ',
  '|INTRO| might I suggest some |DANG| |DESTINATION|!?',
  '|INTRO| You guys getting dat GROUP DISCOUNT!? Go to |DESTINATION| for a change! :fist::skin-tone-5:',
];

const kidsReponses = [
  'I don\'t run a |DANG| day care here keep dem kids away! :fist::skin-tone-5:',
  '|DANG| kids, keep em away from me',
  'I\'m |DANG| outta here if you\'re bringing kids around here',

];

const wasters = [
  'hm...',
  'well',
  'with a little bit of lemon and mint.',
  'interesting...',
];

const farts = [
  '_farts_ BRAAAAAAAAAAAAAPT',
  '_farts_ in Jordan\'s direction',
  ':monkey: :dash:  :wtf:',
  '_toots explosively_',
];

const mikeInsultIntro = [
  '',
  'I just wanted to tell yah,',
  'I just want to say,',
];

module.exports = {
  getMikeCompliment() {
    let compliment = _.sample(complimentStore.compliments);
    compliment = compliment.replace('|MIKE_DANG|', _.sample(mikeDangs));
    return compliment;
  },
  getMikeFart() {
    return _.sample(farts);
  },
  getMikeInsult() {
    let insult = _.sample(insultStore.insults);
    insult = insult.replace('|MIKE_DANG|', _.sample(mikeDangs));
    return insult;
  },
  getMikeInsultLowercase() {
    let insult = _.sample(insultStore.insults);
    insult = insult.replace('|MIKE_DANG|', _.sample(mikeDangs));
    // lower case first letter
    insult = insult.charAt(0).toLowerCase() + insult.slice(1);
    return insult;
  },
  getMikeDang() {
    return _.sample(mikeDangs);
  },
  getMikeMornin() {
    return _.sample(mikeMornin);
  },
  getWaster() {
    return _.sample(wasters);
  },
  getLunchMike() {
    const myDate = new Date();
    let msg = _.sample(lunchMikes).replace('|DANG|', _.sample(mikeDangs));
    msg = msg.replace('|DESTINATION|', _.sample(lunchStore.places));
    msg = msg.replace('|INTRO|', _.sample(lunchIntro));

    if (myDate.getHours() > 5 && myDate.getHours() <= 15) {
      return msg;
      /* Else if hour is past 3pm it is like totes Dinner time for Mike */
    } else if (myDate.getHours() >= 15) {
      return `it's ${_.sample(mikeDangs)} past lunch time. Go to monks pub or make yourself some dinner.`;
    }
    return msg;
  },
  getPersonalizedLunchMike(userID) {
    const myDate = new Date();
    let msg = _.sample(lunchMikes).replace('|DANG|', _.sample(mikeDangs));
    msg = msg.replace('|DESTINATION|', _.sample(lunchStore.places));
    msg = msg.replace('|INTRO|', _.sample(lunchIntro));

    if (myDate.getHours() > 5 && myDate.getHours() <= 15) {
      return msg;
      /* Else if hour is past 3pm it is like totes Dinner time for Mike */
    } else if (myDate.getHours() >= 15) {
      return `it's ${_.sample(mikeDangs)} past lunch time. Go to the pub or make yourself some gawd dammn dinner.`;
    }
    return msg;
  },
  getLunchDestination() {
    return _.sample(lunchStore.places);
  },
  getSadMikeReaction() {
    return _.sample(sadMikes);
  },
  getMikeHello() {
    return _.sample(mikeHellos).replace(' |USERNAME|', '');
  },
  getBrapt(name) {
    return _.sample(brapts).replace('|USERNAME|', name);
  },
  getBraptPt2() {
    return _.sample(brapts2);
  },
  getProfaneReponse() {
    return _.sample(profaneResponse);
  },
  getBodies(name) {
    return _.sample(bodies).replace('|USERNAME|', name);
  },
  getInsultName() {
    return _.sample(insultNames);
  },
  getBeerFriday() {
    return _.sample(beerFriday);
  },
  getKidsReponse() {
    return _.sample(kidsReponses).replace('|DANG|', _.sample(mikeDangs));
  },
  getInsultIntro() {
    return _.sample(mikeInsultIntro);
  },
  getBirthdayGreeting(name) {
    let birthdayMsg = _.sample(birthday).replace('|USERNAME|', name);
    birthdayMsg = birthdayMsg.replace('|DANG|', _.sample(mikeDangs).toUpperCase());
    return birthdayMsg;
  },
  getPersonalMikeHello(name) {
    let personalHelloMsg = _.sample(mikeHellos).replace('|USERNAME|', name);
    personalHelloMsg += love.getLoveReactionForName(name);
    return personalHelloMsg;
  },
};
