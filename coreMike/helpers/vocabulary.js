
var mikeDangs = [
    'god digggidy',
    'gaddd dannng',
    'garsh darn',
    'ɡaddanng',
    'goddamn'
];

var mikeMornin = [
    "Mornin Mornin!",
    'MOOORNIN MOORNIN!!!1',
    '\'Mornin \'Mornin',
    'Buenos DANG días días! :flag-mx:',
    'Morning Morning!!!'
];

var sadMikes = [
    ':thumbsdown::skin-tone-5:',
    ':rage:',
    ':sob:'
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
    getSadMikeReaction: function getMikeDang() {
        var index = Math.floor(Math.random() * sadMikes.length);
        return sadMikes[index];
    }
}