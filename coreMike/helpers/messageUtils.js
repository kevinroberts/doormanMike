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
    },

    postMikeFist: function postMikeFist(bot, message) {
       this.postReaction(bot, message, 'fist::skin-tone-5')
    },

    getUsernameFromController: function getUsernameFromController(controller, user, callback) {

        controller.storage.users.get(user, function(err, userObj) {
            if (userObj && userObj.name) {
                callback(userObj.name);
            } else {
                callback("<@" + user + ">");
            }
        });
    },

    multiSearchOr: function multiSearchOr(text, searchWords){
            // create a regular expression from searchwords using join and |. Add "gi".
            // Example: ["ANY", "UNATTENDED","HELLO"] becomes
            // "ANY|UNATTENDED|HELLO","gi"
            // | means OR. gi means GLOBALLY and CASEINSENSITIVE
            var regex = '';
            for (var i = 0; i < searchWords.length; i++) {
                regex += "\\b(";
                regex += searchWords[i];
                regex += ")\\b";
                if (i < searchWords.length-1) {
                    regex += "|"
                }
            }
            var searchExp = new RegExp(regex,"gi");

            // regularExpression.test(string) returns true or false
            return (searchExp.test(text));
    },

    formatUptime: function formatUptime(uptime) {
        // if uptime is greater than one day
        if (uptime > 86400) {
            var days    = Math.floor(uptime / 86400);
            var hours   = Math.floor((uptime - (days * 86400)) / 3600);
            var minutes = Math.floor((uptime - ((hours * 3600)+(days * 86400))) / 60);
            var seconds = uptime - (days * 86400) - (hours * 3600) - (minutes * 60);

            if (days   < 10) {days   = "0"+days;}
            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}

            return days + ' days : ' + hours + ' hrs : ' + minutes + ' minutes : ' + Math.round(seconds) + ' seconds';

        } else {
            // else uptime is less than a day
            var hours   = Math.floor(uptime / 3600);
            var minutes = Math.floor((uptime - (hours * 3600)) / 60);
            var seconds = uptime - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours + ' hrs : ' + minutes + ' minutes : ' + Math.round(seconds) + ' seconds';
        }
    }


};