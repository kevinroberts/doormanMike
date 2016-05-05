
var dayOfWeek = require('day-of-week').get
var vocabulary = require('../helpers/vocabulary');
var messageUtils = require('../helpers/messageUtils');

var timezoneEnv = process.env.TIMEZONE;
function getDefaultTz() {
    if (timezoneEnv == null) {
        return 'America/Chicago';
    } else {
        return timezoneEnv;
    }
}

function getDayOfWeek(timezone) {
    if (timezone == null) {
        return dayOfWeek(new Date(), getDefaultTz());
    } else {
        return dayOfWeek(new Date(), timezone);
    }
}

module.exports = {

    questionResponse: function questionResponse(username, bot, message) {
        var day = getDayOfWeek();
        var msg = '';
        if (day == 1) {
            msg = "it's " + vocabulary.getMikeDang().toUpperCase() + " MONDAY DON'T TALK TO ME!! " + vocabulary.getSadMikeReaction();
        }
        if (day == 2) {
            msg = "it's " + vocabulary.getMikeDang().toUpperCase() + " HUMPDAY'S EVE!! :fist::skin-tone-5:";
        }
        if (day == 3) {
            msg = "it's " + vocabulary.getMikeDang().toUpperCase() + " :camel: HUMPDAY :camel: !!!! :fist::skin-tone-5:";
            if (bot != null && message != null) {
                messageUtils.postReaction(bot, message, 'camel');
            }
        }
        if (day == 4) {
            msg = "it's " + vocabulary.getMikeDang().toUpperCase() + " FRIDAY'S EVE!!!! :fist::skin-tone-5:";
        }
        if (day == 5) {
            msg = "it's " + vocabulary.getMikeDang().toUpperCase() + " FRIDAY!!!! :fist::skin-tone-5:";
            if (bot != null && message != null) {
                messageUtils.postReaction(bot, message, 'fist');
            }
        }
        if (day > 5) {
            msg = "HAPPY " + vocabulary.getMikeDang().toUpperCase() + " WEEKEND BRO!!!! :fist::skin-tone-5:";
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
            msg = vocabulary.getMikeDang().toUpperCase() + " MONDAY DON'T TALK TO ME!! " + vocabulary.getSadMikeReaction();
        }
        if (day == 2) {
            msg = "HAPPY " + vocabulary.getMikeDang().toUpperCase() + " HUMPDAY'S EVE!! :fist::skin-tone-5:";
        }
        if (day == 3) {
            msg = "HAPPY " + vocabulary.getMikeDang().toUpperCase() + " :camel: HUMPDAY :camel: !!!! :fist::skin-tone-5:";
        }
        if (day == 4) {
            msg = "HAPPY " + vocabulary.getMikeDang().toUpperCase() + " FRIDAY'S EVE!!!! :fist::skin-tone-5:";
        }
        if (day == 5) {
            msg = "HAPPY " + vocabulary.getMikeDang().toUpperCase() + " FRIDAY!!!! :fist::skin-tone-5:";
        }
        if (day > 5) {
            msg = "HAPPY " + vocabulary.getMikeDang().toUpperCase() + " WEEKEND BRO!!!! :fist::skin-tone-5:";
        }

        return msg;
    },

    getMikeMorninTimeSensitive: function getMikeMornin(user) {
        var mikeDang = vocabulary.getMikeDang();
        var mikeMornin = vocabulary.getMikeMornin();

        var myDate = new Date();
        // only trigger if hour is before noon
        var dayResponse = this.statementResponse();
        if (myDate.getHours() < 12) {
            if (user) {
                return "<@" + user + "> " + mikeMornin + "\n" + dayResponse;
            } else {
                return mikeMornin + "\n" + dayResponse;
            }
        }
        /* Hour is from noon to 5pm (actually to 5:59 pm) */
        else if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
            if (user) {
                return "<@" + user + "> get to that sack-room it's da afternoon yo!";
            } else {
                return "get to that sack-room it's da afternoon yo!";
            }
        }
        /* the hour is after 5pm, so it is between 6pm and midnight */
        else if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
            if (user) {
                return "<@" + user + "> " + mikeDang + " :sleeping: ";
            } else {
                return mikeDang + " zZz :sleeping: ";
            }
        }
    },

    getDayOfTheWeek: function getDayOfTheWeek(timezone) {
        if (timezone == null) {
            return dayOfWeek(new Date(), getDefaultTz());
        } else {
            return dayOfWeek(new Date(), timezone);
        }
    }



};