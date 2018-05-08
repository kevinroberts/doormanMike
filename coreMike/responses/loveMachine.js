const _ = require('lodash');

const catCrush = [
  'Agnes',
  'U254REJ05',
];

const specialCrushes = [
  'vinberts',
  'U1THK0L78', // vinberts user id
  'U1THN8CKE', // kyles user id
  'U1TJ14XC1', // jmolsen
  'Kevin',
  'Jeff',
  'Murl',
  'Kyle',
  'kyle.keller',
];

const mikeCrush = [
  'ooh tho ',
  'oi :kissing_closed_eyes:, keep being u :tiger: ',
  'raawwrr :tiger: :heart: ',
  // ':heart: :rose: :rose: :rose: :heart:',
  ':heart: :powers: :heart:',
];

const mikeCats = [
  ':cat: ',
  ':cat2: ',
];


module.exports = {

  getLoveReactionForName(name) {
    let mikeCrushMsg = '';
    _.forEach(specialCrushes, (crush) => {
      // if passed name contains a crush
      const re = new RegExp(crush, 'i');
      if (name.search(re) !== -1) {
        mikeCrushMsg = ` \n${_.sample(mikeCrush)}\n`;
      }
    });

    _.forEach(catCrush, (crush) => {
      // if passed name contains a crush
      const re = new RegExp(crush, 'i');
      if (name.search(re) !== -1) {
        mikeCrushMsg = ` ${_.sample(mikeCats)}`;
      }
    });

    return mikeCrushMsg;
  },
};
