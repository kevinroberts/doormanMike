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
            let definitions = `The following definition(s) were found for the word ${word}\n`;
            let limit = 5;
            _.each(result.body, (definition) => {
              limit -= 1;
              if (limit > 0) {
                const formattedDefinition = `_${definition.partOfSpeech}_. ${definition.text}\n`;
                definitions += `*${word}*\n`;
                definitions += formattedDefinition;
              }
            });
            callback(definitions);
          } else {
            callback(false);
          }
        } else {
          console.log(`could not get definition for: ${word}`, result.status);
          callback(false);
        }
      });
  },
};

