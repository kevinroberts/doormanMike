
var dayOfWeek = require('day-of-week').get
var vocabulary = require('../helpers/vocabulary');
var messageUtils = require('../helpers/messageUtils');
var _ = require('lodash');

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
                messageUtils.postMikeFist(bot, message);
            }
        }
        if (day > 5) {
            msg = "IT'S THE " + vocabulary.getMikeDang().toUpperCase() + " WEEKEND BRO!!!! :fist::skin-tone-5:";
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


    favoriteDayResponse: function favoriteDayResponse(user) {
        var day = getDayOfWeek();

        var mikeResponses = [
            '|USERNAME| IT\'S DEFINITELY NOT ' + vocabulary.getMikeDang().toUpperCase() + " MONDAY... I HATE MONDAY " + vocabulary.getSadMikeReaction(),
            "MONDAY... JUST kidding I " + vocabulary.getMikeDang().toUpperCase() + " HATE MONDAY.",
            vocabulary.getMikeDang().toUpperCase() + ' FRRIIIDAYYYYYYYYYY! :whiskey: ',
            'the lord made friday and should have stopped there. TGIF is my favorite place on earth. Also I got shit to do this weekend. :fist::skin-tone-5: ',
            '|USERNAME| IT IS ' + vocabulary.getMikeDang().toUpperCase() + ' FRIDAY :heart: OF COURSE'
        ];
        
        var msg = _.sample(mikeResponses).replace("|USERNAME|", user);

        if (day == 1) {
            var mikeResponses2 = [
                "I haven't had this bad of a Monday since last Monday...",
                "ugh it actually is monday *shudders*",
                "God gave us Mondays to punish us for the things we did over the weekend.",
                "...good thing i got some :whiskey: under this desk"
            ];

            msg += "\n" + _.sample(mikeResponses2);

        }

        if (day == 5) {
            msg = "ITS DEFINITELY " + vocabulary.getMikeDang().toUpperCase() + " TODAY - CUZ ITS FRIDAY! TGIF!"
        }

        if (day > 5) {
            msg += "\nand its the weekend soo stop asking me silly questions."
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
                return user + " " + mikeMornin + "\n" + dayResponse;
            } else {
                return mikeMornin + "\n" + dayResponse;
            }
        }
        /* Hour is from noon to 5pm (actually to 5:59 pm) */
        else if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
            if (user) {
                return user + " get to that sack-room it's da afternoon yo!";
            } else {
                return "get to that sack-room it's da afternoon yo!";
            }
        }
        /* the hour is after 5pm, so it is between 6pm and midnight */
        else if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
            if (user) {
                return user + " I'M " + mikeDang.toUpperCase() + " :sleeping: NOW GO AWAY DOORMAN MIKE NEEDS HIS BEAUTY SLEEP";
            } else {
                return "I am " + mikeDang + " zZz :sleeping: ";
            }
        }
    },

    getMikeMondayResponse: function getMikeMondayResponse(user, bot, message) {
        var mikeResponses = [
            '|USERNAME| eew :scream: ' + vocabulary.getMikeDang().toUpperCase() + " MONDAY... I HATE MONDAY ",
            "MONDAY i dont even like saying the " + vocabulary.getMikeDang() + " word",
            "|USERNAME|, God gave us Mondays to punish us for the things we did over the weekend."
        ];

        messageUtils.postReaction(bot, message, 'scream');
        
        return _.sample(mikeResponses).replace("|USERNAME|", user);
    },

    getDayOfTheWeek: function getDayOfTheWeek(timezone) {
        if (timezone == null) {
            return dayOfWeek(new Date(), getDefaultTz());
        } else {
            return dayOfWeek(new Date(), timezone);
        }
    }



};