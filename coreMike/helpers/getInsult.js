var S = require('string');
var unirest = require('unirest');
var cheerio = require('cheerio');
var vocabulary = require('../helpers/vocabulary');
var messageUtils = require('../helpers/messageUtils');

module.exports = {

    postMikeInsult: function (bot, message, user, channel) {
        unirest.get("http://www.pangloss.com/seidel/Shaker/index.html")
            .end(function (result) {
                if (result && result.status == 200) {
                    if (result.body) {
                        var $ = cheerio.load(result.body);
                        var insult = $('p:first-of-type').text();
                        var from = $('p').text().split('\n\n')[1];
                        insult = S(insult).replaceAll("\n", "").s;
                        insult += '\n' + from;
                        if (channel != null) {
                            messageUtils.postMessage(bot, channel, user + " " + insult);
                        } else {
                            bot.reply(message, "<@"+user+"> " + insult);
                        }
                    }
                } else {
                    console.log("could not get fact for doorman mike: ", result.status);
                    if (channel != null) {
                        messageUtils.postMessage(bot, channel, user + " " + "you smell like shit, you should take a " + vocabulary.getMikeDang() + " shower");
                    } else {
                        bot.reply(message, "<@"+user+"> you smell like shit, you should take a " + vocabulary.getMikeDang() + " shower")
                    }
                }
            });
    }
};

