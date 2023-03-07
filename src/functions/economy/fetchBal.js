const { default: mongoose } = require("mongoose");
const Balance = require("../../schemas/balance");

module.exports = (client) => {
  client.fetchBal = async (userID, guildID) => {
    let storedBal = await Balance.findOne({
      userID,
      guildID,
    });

    if (!storedBal) {
      storedBal = await new Balance({
        _id: mongoose.Types.ObjectId(),
        userID,
        guildID,
      });
      await storedBal.save().catch((err) => console.log(err));
      return storedBal;
    } else return storedBal;
  };
};
