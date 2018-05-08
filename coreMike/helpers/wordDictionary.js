const unirest = require('unirest');
const _ = require('lodash');

module.exports = {

  getDefinition(word, callback) {
    unirest.get(`http://api.wordnik.com/v4/word.json/${word}/definitions`)
      .header('api_key', process.env.WORDNIKKEY)
      .header('Accept', 'application/json')
      .end((result) => {
        if (result && result.status === 200) {
          if (result.body) {
            let definitions = `*${word}* ${result.body.length} definitions found\n`;
            _.each(result.body, (definition) => {
              const formattedDefinition = `_${definition.partOfSpeech}_. ${definition.text}\n`;
              definitions += formattedDefinition;
            });
            callback(definitions);
          } else {
            callback(null);
          }
        } else {
          console.log(`could not get definition for: ${word}`, result.status);
          callback(null);
        }
      });
  },
};

