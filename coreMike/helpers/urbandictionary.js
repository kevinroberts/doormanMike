const _ = require('lodash');
const unirest = require('unirest');
const S = require('string');

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

  getUrbanDefinition(word, defNumber, callback) {
    const defNum = defNumber || 0;
    unirest.get(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${word}`)
      .header('X-Mashape-Key', process.env.MASHAPEKEY)
      .header('Accept', 'application/json')
      .end((result) => {
        if (result && result.status === 200) {
          if (result.body.list) {
            if (result.body.list[0]) {
              // return the first definition by default
              let def = result.body.list[0];
              if (result.body.list.length >= defNum) {
                def = result.body.list[defNum];
              }
              if (result.body.tags) {
                def.tags = result.body.tags;
              } else {
                def.tags = [];
              }
              callback(def);
            } else {
              callback(null);
            }
          } else {
            callback(null);
          }
        } else {
          console.log(`could not get urban definition for: ${word}`, result.status);
          callback(null);
        }
      });
  },
  postFormattedDefinition(bot, message, word, defNumber, callback) {
    this.getUrbanDefinition(word, defNumber, (result) => {
      if (result) {
        let msgText = result.definition;
        // replace all the bracketed definitions with actual links
        const linkExtractor = new RegExp(/\[([\w!@#'.$\- ]+)\]/g);
        if (linkExtractor.test(msgText)) {
          const res = msgText.match(linkExtractor);
          for (let i = 0; i < res.length; i += 1) {
            const linkToReplace = res[i];
            const linkWithoutBrackets = linkToReplace.replace(/\[|\]/g, '');
            // remove the ending apostrophe "s" from definitions (invalid results)
            const linkToSearch = S(linkWithoutBrackets).chompRight("'s").s;
            msgText = msgText.replace(linkToReplace, `<https://www.urbandictionary.com/define.php?term=${linkToSearch}|${linkWithoutBrackets}>`);
          }
        }
        const fields = [];
        if (result.example) {
          let exTxt = result.example;
          if (linkExtractor.test(exTxt)) {
            const results = exTxt.match(linkExtractor);
            for (let j = 0; j < results.length; j += 1) {
              const ltor = results[j];
              const linkWOutBrackets = ltor.replace(/\[|\]/g, '');
              exTxt = exTxt.replace(ltor, `<https://www.urbandictionary.com/define.php?term=${linkWOutBrackets}|${linkWOutBrackets}>`);
            }
          }
          fields.push({
            title: 'Example',
            value: exTxt,
            short: false,
          });
        }
        if (result.tags.length > 0) {
          const tags = _.uniq(result.tags);
          fields.push({
            title: 'tags',
            value: tags.join(', '),
            short: tags.length < 5,
          });
        }
        // Remove to add Urban Dictionary author to display
        // if (result.author) {
        //   fields.push({
        //     "title": "Author",
        //     "value": result.author,
        //     "short": true
        //   });
        // }


        bot.reply(message, {
          attachments: [
            {
              fallback: result.definition,
              title_link: result.permalink,
              title: word,
              text: msgText,
              color: '#EFFF00',
              attachment_type: 'default',
              fields,
            },
          ],
        });
        callback(true);
      } else {
        callback(false);
      }
    });
  },
};

