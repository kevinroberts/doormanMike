var _ = require('lodash');

var catCrush = [
    'Agnes',
    'U254REJ05'
];

var specialCrushes = [
    'vinberts',
    'U1THK0L78', // vinberts user id
    'U1THN8CKE', // kyles user id
    'U1TJ14XC1', // jmolsen
    'Kevin',
    'Jeff',
    'Murl',
    'Kyle',
    'kyle.keller'
];

var mikeCrush = [
    'ooh tho ',
    'oi :kissing_closed_eyes:, keep being u :tiger: ',
    'raawwrr :tiger: :heart: ',
    //':heart: :rose: :rose: :rose: :heart:',
    ':heart: :powers: :heart:'
];

var mikeCats =  [
    ':cat: ',
    ':cat2: '
];


module.exports = {

    getLoveReactionForName: function (name) {
        var mikeCrushMsg = '';
        _.forEach(specialCrushes, function(crush) {
            // if passed name contains a crush
            var re = new RegExp(crush,"i");
            if (name.search(re) !== -1) {
                mikeCrushMsg = " \n" + _.sample(mikeCrush) + '\n';
            }
        });

        _.forEach(catCrush, function(crush) {
            // if passed name contains a crush
            var re = new RegExp(crush,"i");
            if (name.search(re) !== -1) {
                mikeCrushMsg = " " +  _.sample(mikeCats);
            }
        });

        return mikeCrushMsg;

    }
};