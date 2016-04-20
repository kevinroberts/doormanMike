
var dayOfWeek = require('day-of-week').get

function getDayOfWeek(timezone) {
    if (timezone == null) {
        return dayOfWeek(new Date(), 'America/Chicago');
    } else {
        return dayOfWeek(new Date(), timezone);
    }
}

module.exports = {

    questionResponse: function questionResponse(username, bot, message) {
        var day = getDayOfWeek();
        var msg = '';
        if (day == 1) {
            msg = "it's GOD DANG MONDAY DON'T TALK TO ME!! :thumbsdown::skin-tone-5:";
        }
        if (day == 2) {
            msg = "it's GOD DANG HUMPDAY'S EVE!! :fist::skin-tone-5:";
        }
        if (day == 3) {
            msg = "it's GOD DANG :camel: HUMPDAY :camel: !!!! :fist::skin-tone-5:";
            if (bot != null && message != null) {
                    bot.api.reactions.add({
                        timestamp: message.ts,
                        channel: message.channel,
                        name: 'camel',
                    }, function(err, res) {
                        if (err) {
                            bot.botkit.log('Failed to add emoji reaction :(', err);
                        }
                    });
                }
        }
        if (day == 4) {
            msg = "it's GOD DANG FRIDAY'S EVE!!!! :fist::skin-tone-5:";
        }
        if (day == 5) {
            msg = "it's GOD DANG FRIDAY!!!! :fist::skin-tone-5:";
        }
        if (day > 5) {
            msg = "HAPPY MOTHER FLIPPIN WEEKEND BRO!!!! :fist::skin-tone-5:";
        }
        if (username != null) {
            msg = username + ' ' + msg;
        }
        return msg;
    },

    statementResponse: function statementResponse() {

        var day = getDayOfWeek();

        var msg = '';
        if (day == 1) {
            msg = "DANG MONDAY DON'T TALK TO ME!! :thumbsdown::skin-tone-5:";
        }
        if (day == 2) {
            msg = "HAPPY GOD DANG HUMPDAY'S EVE!! :fist::skin-tone-5:";
        }
        if (day == 3) {
            msg = "HAPPY GOD DANG :camel: HUMPDAY :camel: !!!! :fist::skin-tone-5:";
        }
        if (day == 4) {
            msg = "HAPPY GOD DANG FRIDAY'S EVE!!!! :fist::skin-tone-5:";
        }
        if (day == 5) {
            msg = "HAPPY GOD DANG FRIDAY!!!! :fist::skin-tone-5:";
        }
        if (day > 5) {
            msg = "HAPPY MOTHER FLIPPIN WEEKEND BRO!!!! :fist::skin-tone-5:";
        }

        return msg;
    },

    getDayOfTheWeek: function getDayOfTheWeek(timezone) {
        if (timezone == null) {
            return dayOfWeek(new Date(), 'America/Chicago');
        } else {
            return dayOfWeek(new Date(), timezone);
        }
    }



};