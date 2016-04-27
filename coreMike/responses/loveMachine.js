var _ = require('lodash');

var catCrush = [
    'Agnes',
    'U0P7GGJVB', //agnes
    'U0MKH8B7W'
];

var specialCrushes = [
    'vinberts',
    'U0H0JKGLC', // vinberts user id
    'U0H0DARFW', // kyles user id
    'U0LN5LAQL', // jmolsen
    'Kevin',
    'Kev',
    'Jeff',
    'Murl',
    'Kyle',
    'kyle.keller'
];

var mikeCrush = [
    'ooh tho :kissing_heart: ',
    'oi :kissing_closed_eyes:, keep being u :tiger: ',
    'raawwrr :tiger: :heart: ',
    ':heart: :rose: :rose: :rose: :heart:',
    ':heart: :powers: :heart:'
];

var mikeCats =  [
    ':cat: ',
    ':cat2: '
];


module.exports = {

    getLoveReactionForName: function getLoveReactionForName(name) {
        var mikeCrushMsg = '';
        _.forEach(specialCrushes, function(crush) {
            // if passed name contains a crush
            var re = new RegExp(crush,"i");
            if (name.search(re) !== -1) {
                var index = Math.floor(Math.random() * mikeCrush.length);
                mikeCrushMsg = " \n" + mikeCrush[index] + '\n';
            }
        });

        _.forEach(catCrush, function(crush) {
            // if passed name contains a crush
            var re = new RegExp(crush,"i");
            if (name.search(re) !== -1) {
                var index = Math.floor(Math.random() * mikeCats.length);
                mikeCrushMsg = " " + mikeCats[index];
            }
        });

        return mikeCrushMsg;

    }
};