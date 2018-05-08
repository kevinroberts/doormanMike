const S = require('string');
const unirest = require('unirest');
const vocabulary = require('../helpers/vocabulary');

module.exports = {

  getMikeFact(bot, message) {
    unirest.get('https://api.chucknorris.io/jokes/random')
      .header('Accept', 'application/json')
      .end((result) => {
        if (result && result.status == 200) {
          if (result.body.value) {
            let fact = result.body.value;
            fact = S(fact).replaceAll('chuck norris', 'doorman mike')
              .replaceAll('Chuck Norris', 'Doorman Mike')
              .replaceAll('Chuck norris', 'Doorman Mike')
              .replaceAll('Chuck', 'Mike')
              .replaceAll('chuck', 'Mike')
              .replaceAll("Norris'", 'Mike')
              .replaceAll('Norris', 'Mike')
              .replaceAll('CHUCK NORRIS', 'DOORMAN MIKE')
              .replaceAll('roundhouse kick', ':fist::skin-tone-5:')
              .replaceAll('roundhouse-kicks', ':fist::skin-tone-5:s')
              .replaceAll('roundhouse-kick', ':fist::skin-tone-5:s')
              .replaceAll('kick', ':fist::skin-tone-5:').s;
            bot.reply(message, fact);
          }
        } else {
          console.log('could not get fact for doorman mike: ', result.status);
          bot.reply(message, vocabulary.getWaster());
        }
      });
  },
};

