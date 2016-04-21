var development = process.env.NODE_ENV !== 'production';

module.exports = {

    postMessage: function postMessage(bot, channel, message) {

        // if you are posting to more than one channel at once
        if (channel instanceof Array) {

            for (var i = 0, len = channel.length; i < len; i++) {
                var curChannel = channel[i];
                bot.api.chat.postMessage({'channel' : curChannel, 'text' : message, 'as_user' : true}, function (err, res) {
                    if (development) {
                        bot.botkit.log(res);
                    }
                });
            }
        } else {
            // post to a single channel
            bot.api.chat.postMessage({'channel' : channel, 'text' : message, 'as_user' : true}, function (err, res) {
                if (development) {
                    bot.botkit.log(res);
                }
            });
        }
    },

    postReaction: function postReaction(bot, message, emojiName) {

        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: emojiName,
        }, function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(', err);
            }
        });
    }


}