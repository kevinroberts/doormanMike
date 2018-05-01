var vocabulary = require('../helpers/vocabulary');

// node constructor pattern https://github.com/FredKSchott/the-node-way/blob/master/02-custom-type-example.js

const CleverbotAPI = require('cleverbot-api');
const cleverbot = new CleverbotAPI(process.env.CLEVERBOTAPI);


module.exports = {
  getCleverBotResponse: function (message, callback) {
    cleverbot.getReply ({
      input: message.text
    }, (error, response) => {
      if(error) {
        console.log('cleverbot err received', error);

        callback(vocabulary.getWaster());
      } else {
        let msg = response.output;
        if (msg) {
          if (msg.indexOf('HAL') !== -1) {
            msg = msg.replace('HAL', "<@"+message.user+">");
          }
          if (msg.indexOf('Cleverbot') !== -1) {
            msg = msg.replace('Cleverbot', "Mike");
          }
          callback(msg);
        } else {
          console.log("clever bot response was empty: ", response);
          callback(vocabulary.getWaster());

        }
      }
  });
  }
};