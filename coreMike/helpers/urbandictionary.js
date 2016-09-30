var S = require('string');
var unirest = require('unirest');

// "list": [
//     {
//         "definition": "definition",
//         "permalink": "http://kjkljl",
//         "thumbs_up": 15581,
//         "author": "KryptonicDream",
//         "word": "Superman",
//         "defid": 1055531,
//         "current_vote": "",
//         "example": "\"Yo, \"",
//         "thumbs_down": 5284
//     },

module.exports = {

    getUrbanDefinition: function (word, callback) {
        unirest.get("https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + word)
            .header("X-Mashape-Key", process.env.MASHAPEKEY)
            .header("Accept", "application/json")
            .end(function (result) {
                if (result && result.status == 200) {
                    if (result.body.list) {
                        if (result.body.list[0]) {
                            var def = result.body.list[0];
                            var formattedDefinition = "*" + def.word + "*\n\n" + def.definition + "\n" + def.permalink;
                            callback(formattedDefinition);
                        } else {
                            callback(null);
                        }
                    } else {
                        callback(null);
                    }
                } else {
                    console.log("could not get urban definition for: " + word, result.status);
                    callback(null);
                }
            });
    }
};

