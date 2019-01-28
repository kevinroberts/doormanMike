const vocabulary = require('../helpers/vocabulary');

// node constructor pattern https://github.com/FredKSchott/the-node-way/blob/master/02-custom-type-example.js

const cleverbot = require('cleverbot.io');

const clever = new cleverbot(process.env.ClEVERBOTUSER, process.env.CLEVERBOTAPI);

clever.setNick('Doorman Mike');

module.exports = {
  getCleverBotResponse(message, callback) {
    clever.create(function (err, session) {
      clever.ask(message.text, function (error, response) {
        if (error) {
          console.log('cleverbot err received', error);

          callback(vocabulary.getWaster());
        } else {
          let msg = response;
          if (msg) {
            if (msg.indexOf('HAL') !== -1) {
              msg = msg.replace('HAL', `<@${message.user}>`);
            }
            if (msg.indexOf('Cleverbot') !== -1) {
              msg = msg.replace('Cleverbot', 'Mike');
            }
            callback(msg);
          } else {
            console.log('clever bot response was empty: ', response);
            callback(vocabulary.getWaster());
          }
        }
      });
    });
  },
};
