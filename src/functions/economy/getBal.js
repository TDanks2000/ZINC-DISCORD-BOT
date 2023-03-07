const Balance = require("../../schemas/balance");

module.exports = (client) => {
  client.getBal = async (userID, guildID) => {
    let storedBal = await Balance.findOne({
      userID,
      guildID,
    });

    if (!storedBal) return false;
    else return storedBal;
  };
};
