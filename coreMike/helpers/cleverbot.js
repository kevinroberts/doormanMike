const vocabulary = require('../helpers/vocabulary');

// node constructor pattern https://github.com/FredKSchott/the-node-way/blob/master/02-custom-type-example.js

const Cleverbot = require('cleverbot');

const clev = new Cleverbot({
  key: process.env.CLEVERBOTAPI,
});

module.exports = {
  getCleverBotResponse(message, callback) {
    clev.query(message.text).then((response) => {
      let msg = response.output;
      if (msg) {
        if (msg.indexOf('HAL') !== -1) {
          msg = msg.replace('HAL', `<@${message.user}>`);
        }
        if (msg.indexOf('Cleverbot') !== -1) {
          msg = msg.replace('Cleverbot', 'Mike');
        }
        callback(msg);
      }
    }).catch((error) => {
      console.log('clever bot response error: ', error);
      callback(vocabulary.getWaster());
    });
  },
};
