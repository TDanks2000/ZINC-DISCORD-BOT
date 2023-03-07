const chalk = require("chalk");
const Balance = require("../../schemas/balance");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    try {
      const randomBal = Math.random() * (0.7 - 0.3) + 0.3;
      const storedBal = await client.fetchBal(
        message.author.id,
        message.guild.id
      );

      await Balance.findOneAndUpdate(
        {
          _id: storedBal._id,
        },
        {
          balance: await client.toFixedNumber(storedBal.balance + randomBal, 2),
        }
      );
    } catch (err) {
      console.log({
        message: `[Z!NC balance] Error`,
        error: err,
        level: "error",
      });
    }
  },
};
