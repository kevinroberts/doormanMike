
var mikeDangs = [
    'god digggidy',
    'gaddd dannng',
    'garsh darn',
    'goddamn'
];

module.exports = {
    getMikeDang: function getMikeDang() {
        var index = Math.floor(Math.random() * mikeDangs.length);
        return mikeDangs[index];
    }
}