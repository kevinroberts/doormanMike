var S = require('string');
var unirest = require('unirest');
var vocabulary = require('../helpers/vocabulary');

module.exports = {

    getMikeFact: function getMikeFact(bot, message) {
        unirest.get("https://api.chucknorris.io/jokes/random")
            .header("Accept", "application/json")
            .end(function (result) {
                if (result && result.status == 200) {
                    if (result.body.value) {
                        var fact = result.body.value;
                        fact = S(fact).replaceAll("chuck norris", "doorman mike")
                            .replaceAll("Chuck Norris", "Doorman Mike")
                            .replaceAll("Chuck norris", "Doorman Mike")
                            .replaceAll("Chuck", "Mike")
                            .replaceAll("chuck", "Mike")
                            .replaceAll("roundhouse kick", ":fist::skin-tone-5:")
                            .replaceAll("kick", ":fist::skin-tone-5:").s;
                        bot.reply(message, fact);
                    }
                } else {
                    console.log("could not get fact for doorman mike: ", result.status);
                    bot.reply(message, vocabulary.getWaster())
                }
            });
    }
};

