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

var lunchMikes = [
    '\'bout lunch o\'clock who\'s down for some grub!? :fork_and_knife: ',
    'nearin lunch time! I don\'t know about you guy\'s but i\'m cravin some La Cocina :flag-mx: :taco: :flag-mx:',
    'nearin lunch time! might I suggest you go to Tommy\'s Place!?',
    'nearin lunch o\'clock! why don\'t you all take a trip to the |DANG| healthy side for a change and go to Mixed Greens? :leaves: ',
    'nearin lunch o\'clock! might I suggest you go to Blackwood for |DANG| some brisket!? :meat_on_bone: ',
    'nearin lunch time! might I suggest some |DANG| UB DOGS :hamburger: :hotdog: :hamburger:!?',
    'almost lunch! You guys getting dat GROUP DISCOUNT!? :fist::skin-tone-5:'
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
                return "<@" + message.user + "> " + mikeDangs[index2] + " :sleeping: ";
            } else {
                return mikeDangs[index2] + " :sleeping: ";
            }
        }
    },
    getWaster: function getWaster() {
        var index = Math.floor(Math.random() * wasters.length);
        return wasters[index];
    },
    getLunchMike: function getLunchMike() {
        var index = Math.floor(Math.random() * lunchMikes.length);
        var index2 = Math.floor(Math.random() * mikeDangs.length);
        return lunchMikes[index].replace("|DANG|", mikeDangs[index2]);
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