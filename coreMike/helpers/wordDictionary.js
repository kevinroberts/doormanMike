var S = require('string');
var unirest = require('unirest');
var _ = require('lodash');

module.exports = {

  getDefinition: function (word, callback) {
    unirest.get(`http://api.wordnik.com/v4/word.json/${word}/definitions`)
      .header("api_key", process.env.WORDNIKKEY)
      .header("Accept", "application/json")
      .end(function (result) {
        if (result && result.status == 200) {
          if (result.body) {
            var definitions = "*" + word + `* ${result.body.length} definitions found\n`;
            _.each(result.body, function (definition) {
              var formattedDefinition = "_" + definition.partOfSpeech + "_. " + definition.text + "\n";
              definitions += formattedDefinition;
            });
            callback(definitions);
          } else {
            callback(null);
          }
        } else {
          console.log("could not get definition for: " + word, result.status);
          callback(null);
        }
      });
  }
};

