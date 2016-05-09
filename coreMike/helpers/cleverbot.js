var vocabulary = require('../helpers/vocabulary');

// node constructor pattern https://github.com/FredKSchott/the-node-way/blob/master/02-custom-type-example.js
module.exports = Cleverbot;

function Cleverbot(cleverbotIO) {
    this._cleverbotIO = cleverbotIO;
}

Cleverbot.prototype.getCleverBotResponse = function(message, callback) {
    if (!this._cleverbotIO) {
        console.error("no cleverbotIO was configured");
        return '';
    }
    this._cleverbotIO.ask(message.text, function (err, response) {
        if (!err) {
            var msg = response;

            if (response.indexOf('HAL') !== -1) {
                msg = response.replace('HAL', "<@"+message.user+">")
            }
            if (response.indexOf('Cleverbot') !== -1) {
                msg = response.replace('Cleverbot', "Mike")
            }


            callback(msg);

        } else {
            // if no cleverbot response just respond with a generic one
            console.log('cleverbot err: ' + err);

            callback(vocabulary.getWaster());

        }
    });
};