var S = require('string');
var unirest = require('unirest');
var cheerio = require('cheerio');
var vocabulary = require('../helpers/vocabulary');

module.exports = {

    postMikeInsult: function postMikeInsult(bot, message) {
        unirest.get("http://www.insultgenerator.org")
            .end(function (result) {
                if (result && result.status == 200) {
                    if (result.body) {
                        var $ = cheerio.load(result.body);
                        var insult = $('div.wrap').text();
                        insult = S(insult).replaceAll("\n", "").s;
                        bot.reply(message, "<@"+message.user+"> " + insult);
                    }
                } else {
                    console.log("could not get fact for doorman mike: ", result.status);
                    bot.reply(message, "<@"+message.user+"> you smell like shit, you should take a " + vocabulary.getMikeDang() + " shower")
                }
            });
    }
};

