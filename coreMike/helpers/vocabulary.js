var love = require('../responses/loveMachine');
var _ = require('lodash');

var mikeDangs = [
    'gawd damn',
    'gaddd dannng',
    'gad damn',
    'gahdamn',
    'gotdamn',
    'gaddanng',
    'goddamn'
];

var mikeMornin = [
    "Mornin Mornin!",
    'MOOORNIN MOORNIN!!!1',
    '\'Mornin \'Mornin',
    'Buenos DANG días días! :flag-mx:',
    'Morning Morning!!!'
];

var mikeHellos = [
    'Hey |username|! what\'s up?! :fist::skin-tone-5: ',
    'What\'s cookin |username|?!',
    'whats up |username|!!!',
    'Yo |username|!',
    'Hey |username|!'
];

var beerFriday = [
    'It\'s gahdamn :beer: FRIDAY time! Grabs yo self a brew!',
    ':fist::skin-tone-5: SOMEONE SAY GGAAAAAHDAMN BEER FRIDAY TIME!!!!!1@? CUZ IT IS, GRAB YOURSELF A BEER :beers: :fist::skin-tone-5: ',
    'BRAAAPT! its :beer: Friday time! grabs yo self a beer! :fist::skin-tone-5:'
];

var sadMikes = [
    ':thumbsdown::skin-tone-5:',
    ':rage:',
    ':sob:'
];

var lunchIntro = [
    '\'bout lunch o\'clock',
    'nearin lunch time!',
    'LUNCH!!!',
    'nearin lunch o\'clock!',
    'almost lunch!'
];

var brapts = [
    '|username| u stink dude :frog: ',
    '|username| sick - that sounded wet',
    '|username| sometimes you gamble and lose :game_die: '
]

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

var wasters = [
    "hm...",
    "well",
    "interesting..."
];

module.exports = {
    getMikeDang: function getMikeDang() {
        return _.sample(mikeDangs);
    },
    getMikeMornin: function getMikeMornin() {
        return _.sample(mikeMornin);
    },
    getWaster: function getWaster() {
        return _.sample(wasters);
    },
    getLunchMike: function getLunchMike() {
        var myDate = new Date();
        var msg = _.sample(lunchMikes).replace("|DANG|", _.sample(mikeDangs));
        msg = msg.replace("|DESTINATION|", _.sample(lunchDestinations));
        msg = msg.replace("|INTRO|", _.sample(lunchIntro));

        // if the hour is between 5 and 10 am Mike is in breakfast mode
        if (myDate.getHours() > 5 && myDate.getHours() <= 10) {
            return "it's " + _.sample(mikeDangs) + " breakfast time. Go to dunkin dohnuts or make yourself a bagel."
        }
        else if (myDate.getHours() >= 10 && myDate.getHours() <= 15) {
            return msg;
        }/* Hour is past 3pm is like totes Dinner time for Mike*/
        else if (myDate.getHours() >= 15) {
            return "it's " + _.sample(mikeDangs) + " past lunch time. Go to monks pub or make yourself some dinner."
        }

    },
    getLunchDestination : function getLunchDestination() {
        return _.sample(lunchDestinations);
    },
    getSadMikeReaction: function getSadMikeReaction() {
        return _.sample(sadMikes);
    },
    getMikeHello: function getMikeHello() {
        return _.sample(mikeHellos).replace(" |username|", "");
    },
    getBrapt: function getBrapt(name) {
        return _.sample(brapts).replace("|username|", name);
    },
    getBeerFriday: function getBeerFriday(){
        return _.sample(beerFriday);
    },
    getPersonalMikeHello: function getPersonalMikeHello(name) {
        var personalHelloMsg = _.sample(mikeHellos).replace("|username|", name);
        personalHelloMsg += love.getLoveReactionForName(name);
        return personalHelloMsg;
    }
};