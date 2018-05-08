const love = require('../responses/loveMachine');
const _ = require('lodash');
const complimentStore = require('../resources/compliments.json');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('insults');


function getTotalNumberOfInsults(cb) {
  db.get('SELECT count(*) as total FROM insults WHERE used < 1', (err, result) => {
    if (result.total) {
      cb(result.total);
    } else {
      cb(0);
    }
  });
}

function getInsultById(id, cb) {
  db.get('SELECT insult from insults WHERE rowid = ?', id, (err, result) => {
    if (result) {
      cb(result.insult);
    } else {
      cb('');
    }
  });
}

function updateInsultUsedStatus(id, used, cb) {
  db.run('UPDATE insults SET used = $used WHERE rowid = $id', {
    $id: id,
    $used: used,
  }, cb);
}

function resetInsultUsedCount(cb) {
  console.log('resetting insults to 0 used.');
  db.all('SELECT rowid AS id, insult, used FROM insults WHERE used > 0', (err, rows) => {
    rows.forEach((row) => {
      updateInsultUsedStatus(row.id, 0, (result) => {
        console.log(result);
      });
    });
    cb('done');
  });
}


const timesheetResponse = 'and finish that timesheet https://webet.icfi.com/DeltekTC/welcome.msv';

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
  `It's gahdamn :beer: FRIDAY time! Grabs yo self a brew! I bet Tyler has got a dope ass movie playin!\n${timesheetResponse}`,
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

const lunchDestinations = [
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
  'Mixed Greens :leaves: -> https://goo.gl/maps/LkRp5Lq46UJ2',
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

module.exports = {
  getMikeCompliment() {
    return _.sample(complimentStore.compliments);
  },
  getMikeInsult(cb) {
    getTotalNumberOfInsults((number) => {
      if (number > 0) {
        const randomInsultInt = Math.floor(Math.random() * Math.floor(number));
        console.log(`getting random insult with ID: ${randomInsultInt}`);
        getInsultById(randomInsultInt, (insult) => {
          updateInsultUsedStatus(randomInsultInt, 1, () => {
            cb(insult.replace('|MIKE_DANG|', _.sample(mikeDangs)));
          });
        });
      } else {
        // time to reset insult in DB
        resetInsultUsedCount((result) => {
          if (result) {
            getTotalNumberOfInsults((numOfInsults) => {
              const randomInsultInt = Math.floor(Math.random() * Math.floor(numOfInsults));
              getInsultById(randomInsultInt, (insult) => {
                updateInsultUsedStatus(randomInsultInt, 1, () => {
                  cb(insult.replace('|MIKE_DANG|', _.sample(mikeDangs)));
                });
              });
            });
          }
        });
      }
    });
  },
  getMikeInsultLowercase(cb) {
    getTotalNumberOfInsults((number) => {
      if (number > 0) {
        const randomInsultInt = Math.floor(Math.random() * Math.floor(number));
        console.log(`getting random insult with ID: ${randomInsultInt}`);
        getInsultById(randomInsultInt, (insult) => {
          let randomInsult = insult.replace('|MIKE_DANG|', _.sample(mikeDangs));
          randomInsult = randomInsult.charAt(0).toLowerCase() + randomInsult.slice(1);
          updateInsultUsedStatus(randomInsultInt, 1, () => {
            cb(randomInsult);
          });
        });
      } else {
        resetInsultUsedCount((result) => {
          if (result) {
            getTotalNumberOfInsults((numOfInsults) => {
              const randomInsultInt = Math.floor(Math.random() * Math.floor(numOfInsults));
              getInsultById(randomInsultInt, (insult) => {
                let randomInsult = insult.replace('|MIKE_DANG|', _.sample(mikeDangs));
                randomInsult = randomInsult.charAt(0).toLowerCase() + randomInsult.slice(1);
                updateInsultUsedStatus(randomInsultInt, 1, () => {
                  cb(randomInsult);
                });
              });
            });
          }
        });
      }
    });
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
    msg = msg.replace('|DESTINATION|', _.sample(lunchDestinations));
    msg = msg.replace('|INTRO|', _.sample(lunchIntro));

    if (myDate.getHours() > 5 && myDate.getHours() <= 15) {
      return msg;
      /* Else if hour is past 3pm it is like totes Dinner time for Mike */
    } else if (myDate.getHours() >= 15) {
      return `it's ${_.sample(mikeDangs)} past lunch time. Go to monks pub or make yourself some dinner.`;
    }
    return msg;
  },
  getLunchDestination() {
    return _.sample(lunchDestinations);
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
