var S = require('string');
var unirest = require('unirest');


module.exports = {

  getRandomTrump: function (callback) {
    unirest.get("https://api.whatdoestrumpthink.com/api/v1/quotes/random")
      .header("Accept", "application/json")
      .end(function (result) {
        if (result && result.status == 200) {
          if (result.body.message) {
            callback(result.body.message);
          } else {
            callback(null);
          }
        } else {
          console.log("could not get trumpism from api", result.status);
          callback(null);
        }
      });
  }
};

