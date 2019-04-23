const unirest = require('unirest');


module.exports = {

  getKanye(callback) {
    unirest.get('https://api.kanye.rest')
      .header('Accept', 'application/json')
      .end((result) => {
        if (result && result.status === 200) {
          if (result.body.quote) {
            callback(result.body.quote);
          } else {
            callback(null);
          }
        } else {
          console.log('could contact the kanye api', result.status);
          callback(null);
        }
      });
  },
};

