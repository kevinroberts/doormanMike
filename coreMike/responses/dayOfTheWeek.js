const dayOfWeek = require('day-of-week').get;
const vocabulary = require('../helpers/vocabulary');
const messageUtils = require('../helpers/messageUtils');
const _ = require('lodash');

const timezoneEnv = process.env.TIMEZONE;

const mikeWednesdays = [
  'HAPPY |MIKE_DANG| :camel: HUMPDAY :camel: !!!! :fist::skin-tone-5:',
  'IT\'S WEDNESDAY MAH DUDES!! https://storage.googleapis.com/unleash-the-shart.appspot.com/wednesday.png',
];

const mikeMondays = [
  `|MIKE_DANG| MONDAY DON'T TALK TO ME!! ${vocabulary.getSadMikeReaction()}`,
  'IT\'S |MIKE_DANG| Monday!! :sick: https://storage.googleapis.com/unleash-the-shart.appspot.com/today_is_monday.jpg',
];

function getDefaultTz() {
  if (timezoneEnv === null) {
    return 'America/Chicago';
  }
  return timezoneEnv;
}

function getDayOfWeek(timezone) {
  if (timezone === null) {
    return dayOfWeek(new Date(), getDefaultTz());
  }
  return dayOfWeek(new Date(), timezone);
}

module.exports = {

  questionResponse(username, bot, message) {
    const day = getDayOfWeek();
    let msg = '';
    if (day === 1) {
      msg = `it's ${vocabulary.getMikeDang().toUpperCase()} MONDAY DON'T TALK TO ME!! ${vocabulary.getSadMikeReaction()}`;
    }
    if (day === 2) {
      msg = `it's ${vocabulary.getMikeDang().toUpperCase()} HUMPDAY'S EVE!! :fist::skin-tone-5:`;
    }
    if (day === 3) {
      msg = _.sample(mikeWednesdays);
      msg = msg.replace('|MIKE_DANG|', vocabulary.getMikeDang().toUpperCase());
      if (bot !== null && message !== null) {
        messageUtils.postReaction(bot, message, 'camel');
      }
    }
    if (day === 4) {
      msg = `it's ${vocabulary.getMikeDang().toUpperCase()} FRIDAY'S EVE!!!! :fist::skin-tone-5:`;
    }
    if (day === 5) {
      msg = `it's ${vocabulary.getMikeDang().toUpperCase()} FRIDAY!!!! :fist::skin-tone-5:`;
      if (bot != null && message != null) {
        messageUtils.postMikeFist(bot, message);
      }
    }
    if (day > 5) {
      msg = `IT'S THE ${vocabulary.getMikeDang().toUpperCase()} WEEKEND BRO!!!! :fist::skin-tone-5:`;
    }
    if (username !== null) {
      msg = `${username} ${msg}`;
    }
    return msg;
  },

  statementResponse() {
    const day = getDayOfWeek();

    let msg = '';
    if (day === 1) {
      msg = _.sample(mikeMondays);
      msg = msg.replace('|MIKE_DANG|', vocabulary.getMikeDang().toUpperCase());
    }
    if (day === 2) {
      msg = `HAPPY ${vocabulary.getMikeDang().toUpperCase()} HUMPDAY'S EVE!! :fist::skin-tone-5:`;
    }
    if (day === 3) {
      msg = _.sample(mikeWednesdays);
      msg = msg.replace('|MIKE_DANG|', vocabulary.getMikeDang().toUpperCase());
    }
    if (day === 4) {
      msg = `HAPPY ${vocabulary.getMikeDang().toUpperCase()} FRIDAY'S EVE!!!! :fist::skin-tone-5:`;
    }
    if (day === 5) {
      msg = `HAPPY ${vocabulary.getMikeDang().toUpperCase()} FRIDAY!!!! :fist::skin-tone-5:`;
    }
    if (day > 5) {
      msg = `HAPPY ${vocabulary.getMikeDang().toUpperCase()} WEEKEND BRO!!!! :fist::skin-tone-5:`;
    }

    return msg;
  },

  favoriteDayResponse(user) {
    const day = getDayOfWeek();

    const mikeResponses = [
      `|USERNAME| IT'S DEFINITELY NOT ${vocabulary.getMikeDang().toUpperCase()} MONDAY... I HATE MONDAY ${vocabulary.getSadMikeReaction()}`,
      `MONDAY... JUST kidding I ${vocabulary.getMikeDang().toUpperCase()} HATE MONDAY.`,
      `${vocabulary.getMikeDang().toUpperCase()} FRRIIIDAYYYYYYYYYY! :whiskey: `,
      'the lord made friday and should have stopped there. TGIF is my favorite place on earth. Also I got shit to do this weekend. :fist::skin-tone-5: ',
      `|USERNAME| IT IS ${vocabulary.getMikeDang().toUpperCase()} FRIDAY :heart: OF COURSE! The welcome wagon to the weekend. `,
    ];

    let msg = _.sample(mikeResponses).replace('|USERNAME|', user);

    if (day === 1) {
      const mikeResponses2 = [
        "I haven't had this bad of a Monday since last Monday...",
        'ugh it actually is monday *shudders*',
        'God gave us Mondays to punish us for the things we did over the weekend.',
        '...good thing i got some :whiskey: under this desk',
      ];

      msg += `\n${_.sample(mikeResponses2)}`;
    }

    if (day === 5) {
      msg = `ITS DEFINITELY ${vocabulary.getMikeDang().toUpperCase()} TODAY - CUZ ITS FRIDAY! TGIF!`;
    }

    if (day > 5) {
      msg += '\nand its the weekend soo stop asking me silly questions.';
    }

    return msg;
  },

  getMikeMorninTimeSensitive(user) {
    const mikeDang = vocabulary.getMikeDang();
    const mikeMornin = vocabulary.getMikeMornin();

    const myDate = new Date();
    // only trigger if hour is before noon
    const dayResponse = this.statementResponse();
    if (myDate.getHours() < 12) {
      if (user) {
        return `${user} ${mikeMornin}\n${dayResponse}`;
      }
      return `${mikeMornin}\n${dayResponse}`;
      /* Hour is from noon to 5pm (actually to 5:59 pm) */
    } else if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
      if (user) {
        return `${user} get to that sack-room it's da afternoon yo!`;
      }
      return "get to that sack-room it's da afternoon yo!";
      /* the hour is after 5pm, so it is between 6pm and midnight */
    } else if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
      if (user) {
        return `${user} I'M ${mikeDang.toUpperCase()} :sleeping: NOW GO AWAY DOORMAN MIKE NEEDS HIS BEAUTY SLEEP`;
      }
      return `I am ${mikeDang} zZz :sleeping: `;
    }
    return '';
  },

  getMikeMondayResponse(user, bot, message) {
    const mikeResponses = [
      `|USERNAME| eew :scream: ${vocabulary.getMikeDang().toUpperCase()} MONDAY... I HATE MONDAY `,
      `MONDAY i dont even like saying the ${vocabulary.getMikeDang()} word`,
      '|USERNAME|, God gave us Mondays to punish us for the things we did over the weekend.',
    ];

    const mikeReactions = [
      'omg',
      'rage',
      'wtf',
    ];

    messageUtils.postReaction(bot, message, _.sample(mikeReactions));

    return _.sample(mikeResponses).replace('|USERNAME|', user);
  },

  getMikeFridayResponse(user, bot, message) {
    const mikeResponses = [
      `|USERNAME| fucck yea${vocabulary.getMikeDang().toUpperCase()} FRIDAY... I LOVE IT `,
      `FRIDAY i could marry the ${vocabulary.getMikeDang()} word`,
      '|USERNAME|, you tryna start a party? cuz if you say Friday a couple more times, im bring up the :tequila:',
    ];

    const mikeReactions = [
      'dark_sunglasses',
      'dancers',
      'megusta',
    ];

    messageUtils.postReaction(bot, message, _.sample(mikeReactions));

    return _.sample(mikeResponses).replace('|USERNAME|', user);
  },
  getMikeWeekendResponse() {
    const day = getDayOfWeek();

    if (day > 5) {
      const mikeResponsesForWeekend = [
        'Two days is not enough time for the Weekend.',
        'Nothing in the world is more expensive than a woman who’s free for the weekend. :dancer: :fist::skin-tone-5:',
        `It's mah ${vocabulary.getMikeDang()} weekend leave me alone.`,
      ];
      return _.sample(mikeResponsesForWeekend);
    }
    const mikeResponsesNotWeekendYet = [
      'Its not the weekend yet, ask me later',
      `Why wait for the ${vocabulary.getMikeDang()} weekend to have fun? :whiskey:`,
      "Yeah it's not the weekend bro. better days are coming.",
    ];

    return _.sample(mikeResponsesNotWeekendYet);
  },

  getDayOfTheWeek(timezone) {
    if (timezone === null) {
      return dayOfWeek(new Date(), getDefaultTz());
    }
    return dayOfWeek(new Date(), timezone);
  },

};
