var love = require('../responses/loveMachine');
var dayOfTheWeekResponses = require('../responses/dayOfTheWeek');

var mikeDangs = [
    'god digggidy',
    'gaddd dannng',
    'garsh darn',
    'gahdamn',
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
    'Hey |username|! what\'s up?! :fist: ',
    'What\'s cookin |username|?!',
    'whats up |username|!!!',
    'Yo |username|!',
    'Hey |username|!'
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

var lunchDestinations = [
    'La Cocina :flag-mx: :taco: :flag-mx:',
    'Tommy\'s Place -> https://goo.gl/maps/m2hR5yT8gS52',
    'Blackwoods BBQ :meat_on_bone: -> https://goo.gl/maps/7BaCbKpUbLn',
    'Goodwins sandwiches :bread: -> https://goo.gl/maps/uxqAZJG1AYH2',
    'UB DOGS :hamburger: :hotdog: -> :hamburger: https://goo.gl/maps/orVEFT9PMJz',
    'Naf Naf :camel: -> https://goo.gl/maps/JsXP5QABoPu',
    'Halsted Street Deli -> https://goo.gl/maps/kxEk9BCnV9F2',
    'Baccis Pizza -> https://goo.gl/maps/1Ed4fu2rqcM2',
    'Taza for some Mediterranean -> https://goo.gl/maps/NCUk1w3E2am',
    'boring :sleeping: Caffe Baci https://goo.gl/maps/wiCXCFehbq72',
    'Specialty\'s bakery :bread: -> https://goo.gl/maps/XvJmgaGH9852',
    'Costa Vida for some Baja-style :burrito:\'s -> https://goo.gl/maps/L1MtEmRdeYE2',
    'Mixed Greens :leaves: -> https://goo.gl/maps/LkRp5Lq46UJ2'
];

var lunchMikes = [
    '|INTRO| I don\'t know about you guy\'s but i\'m cravin some |DESTINATION|',
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
        var index = Math.floor(Math.random() * mikeDangs.length);
        return mikeDangs[index];
    },
    getMikeMornin: function getMikeMornin() {
        var index = Math.floor(Math.random() * mikeMornin.length);
        return mikeMornin[index];
    },
    getMikeMorninTimeSensitive: function getMikeMornin(user) {
        var index = Math.floor(Math.random() * mikeMornin.length);
        var index2 = Math.floor(Math.random() * mikeDangs.length);
        var morninMsg = mikeMornin[index];
        var myDate = new Date();
        // only trigger if hour is before noon
        if (myDate.getHours() < 12) {
            if (user) {
                return "<@" + user + "> " + morninMsg + "\n" + dayOfTheWeekResponses.statementResponse();
            } else {
                return morninMsg + "\n" + dayOfTheWeekResponses.statementResponse();
            }
        }
        /* Hour is from noon to 5pm (actually to 5:59 pm) */
        else if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
            if (user) {
                return "<@" + user + "> get to that sack-room it's da afternoon yo!";
            } else {
                return "get to that sack-room it's da afternoon yo!";
            }
        }
        /* the hour is after 5pm, so it is between 6pm and midnight */
        else if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
            if (user) {
                return "<@" + user + "> " + mikeDangs[index2] + " :sleeping: ";
            } else {
                return mikeDangs[index2] + " zZz :sleeping: ";
            }
        }
    },
    getWaster: function getWaster() {
        var index = Math.floor(Math.random() * wasters.length);
        return wasters[index];
    },
    getLunchMike: function getLunchMike() {
        var myDate = new Date();
        var index = Math.floor(Math.random() * lunchMikes.length);
        var index2 = Math.floor(Math.random() * mikeDangs.length);
        var index3 = Math.floor(Math.random() * lunchIntro.length);
        var index4 = Math.floor(Math.random() * lunchDestinations.length);
        var msg = lunchMikes[index].replace("|DANG|", mikeDangs[index2]);
        msg = msg.replace("|DESTINATION|", lunchDestinations[index4]);
        msg = msg.replace("|INTRO|", lunchIntro[index3]);

        if (myDate.getHours() >= 10) {
            return "its " + mikeDangs[index2] + " breakfast time. Go to dunkin dohnuts or make yourself a bagel."
        }
        else if (myDate.getHours() >= 10 && myDate.getHours() <= 15) {
            return msg;
        }/* Hour is past 3pm */
        else if (myDate.getHours() >= 15) {
            return "its " + mikeDangs[index2] + " past lunch time. Go to monks pub or make yourself some dinner."
        }

    },
    getLunchDestination : function getLunchDestination() {
        var index = Math.floor(Math.random() * lunchDestinations.length);
        return lunchDestinations[index];
    },
    getSadMikeReaction: function getSadMikeReaction() {
        var index = Math.floor(Math.random() * sadMikes.length);
        return sadMikes[index];
    },
    getMikeHello: function getMikeHello() {
        var index = Math.floor(Math.random() * mikeHellos.length);
        return mikeHellos[index].replace(" |username|", "");
    },
    getPersonalMikeHello: function getPersonalMikeHello(name) {
        var index = Math.floor(Math.random() * mikeHellos.length);
        var personalHelloMsg = mikeHellos[index].replace("|username|", name);
        personalHelloMsg += love.getLoveReactionForName(name);
        return personalHelloMsg;
    }
}