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
    this._cleverbotIO.request(message.text).then( function (response) {
      var msg = response.output;

      if (msg.indexOf('HAL') !== -1) {
        msg = msg.replace('HAL', "<@"+message.user+">");
      }
      if (msg.indexOf('Cleverbot') !== -1) {
        msg = msg.replace('Cleverbot', "Mike");
      }
      callback(msg);
    }).catch(function (error) {
      // if no cleverbot response just respond with a generic one
      console.log('cleverbot err received', error);

      callback(vocabulary.getWaster());
    });
};