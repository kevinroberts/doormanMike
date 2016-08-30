

module.exports = {
    getBotUserID: function () {
        return process.env.BOTID ? process.env.BOTID : 'U1UPQ5GBV';
    },
    getBotUsername: function () {
        return 'doormanmike';
    },
    getAdminUserID: function () {
        return 'U1THK0L78';
    },
    getGeneralChannelID: function () {
        return 'C1THK0QUW';
    },
    getGeneralChannelLink: function () {
        return '<#' + this.getGeneralChannelID() + '>';
    }

};