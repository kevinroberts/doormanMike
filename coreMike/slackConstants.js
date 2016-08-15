

module.exports = {
    getBotUserID: function getBotUserID() {
        return process.env.BOTID ? process.env.BOTID : 'U1UPQ5GBV';
    },
    getAdminUserID: function getAdminUserID() {
        return 'U1THK0L78';
    },
    getGeneralChannelID: function getGeneralChannelID() {
        return 'C1THK0QUW';
    },
    getGeneralChannelLink: function getGeneralChannelLink () {
        return '<#' + this.getGeneralChannelID() + '>';
    }

};