var love = require('../responses/loveMachine');

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
    '\'bout lunch o\'clock who\'s down for some grub :fork_and_knife: ',
    'nearin lunch time! I don\'t know about you guy\'s but i\'m cravin some La Cocina :flag-mx: :taco: :flag-mx:',
    'nearin lunch time! might i suggest some gosh dang UB DOGS :hamburger: :hotdog: :hamburger:!?',
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
    getWaster: function getWaster() {
        var index = Math.floor(Math.random() * wasters.length);
        return wasters[index];
    },
    getLunchMike: function getLunchMike() {
        var index = Math.floor(Math.random() * lunchMikes.length);
        return lunchMikes[index];
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