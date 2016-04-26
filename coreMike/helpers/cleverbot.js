var vocabulary = require('../helpers/vocabulary');

var cleverbot = require("cleverbot.io"),
    cleverbot = new cleverbot(process.env.CLEVERBOTUSER, process.env.CLEVERBOTAPI);
cleverbot.setNick("Mike");
cleverbot.create(function (err, session) {
    if (err) {
        console.log('Cleverbot create fail', err);
    } else {
        console.log('cleverbot create success.');
    }
});

module.exports = {

    getCleverBotResponse: function getCleverBotResponse(message, callback) {

        cleverbot.ask(message.text, function (err, response) {
            if (!err) {
                var msg = response;

                if (response.indexOf('HAL') !== -1) {
                    msg = response.replace('HAL', "<@"+message.user+">")
                }

                callback(msg);

            } else {
                // if no cleverbot response just respond with a generic one
                console.log('cleverbot err: ' + err);

                callback(vocabulary.getWaster());

            }
        });


    }

}