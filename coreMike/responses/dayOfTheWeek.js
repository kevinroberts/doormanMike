
var dayOfWeek = require('day-of-week').get
var vocabulary = require('../helpers/vocabulary');
var messageUtils = require('../helpers/messageUtils');

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

    getDayOfTheWeek: function getDayOfTheWeek(timezone) {
        if (timezone == null) {
            return dayOfWeek(new Date(), 'America/Chicago');
        } else {
            return dayOfWeek(new Date(), timezone);
        }
    }



};