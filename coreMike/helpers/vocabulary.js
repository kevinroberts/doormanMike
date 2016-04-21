
var mikeDangs = [
    'god digggidy',
    'gaddd dannng',
    'garsh darn',
    'ɡaddanng',
    'goddamn'
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
    getSadMikeReaction: function getMikeDang() {
        var index = Math.floor(Math.random() * sadMikes.length);
        return sadMikes[index];
    }
}