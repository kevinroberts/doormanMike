var _ = require('lodash');

var catCrush = [
    'Agnes',
    'U0P7GGJVB', //agnes
    'U0MKH8B7W' //belinda
];

var specialCrushes = [
    'vinberts',
    'U0H0JKGLC', // vinberts user id
    'U0H0DARFW', // kyles user id
    'U0LN5LAQL', // jmolsen
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

    getLoveReactionForName: function getLoveReactionForName(name) {
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