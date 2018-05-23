
module.exports = {
  getBotUserID() {
    return process.env.BOTID ? process.env.BOTID : 'U1UPQ5GBV';
  },
  getBotUsername() {
    return 'doormanmike';
  },
  getAdminUserID() {
    return 'U1THK0L78';
  },
  getPopeUserId() {
    return 'U1THPVAF8';
  },
  getGeneralChannelID() {
    return 'C1THK0QUW';
  },
  getGeneralChannelLink() {
    return `<#${this.getGeneralChannelID()}>`;
  },

};
