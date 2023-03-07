const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay a user some zoins!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to send the zoins to.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of zoins to send.")
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction, client) {
    const userStoredBal = await client.fetchBal(
      interaction.user.id,
      interaction.guild.id
    );
    const selectedUser = interaction.options.getUser("target");

    let amount = interaction.options.getNumber("amount");

    if (selectedUser.bot || selectedUser.id === interaction.user.id)
      return interaction.reply({
        content: "You can't send zoins to bots or yourself!",
        ephemeral: true,
      });

    if (amount < 1.0)
      return interaction.reply({
        content: "You can't send less than 1 zoin!",
        ephemeral: true,
      });

    if (amount > userStoredBal.balance)
      return interaction.reply({
        content: "You don't have enough zoins to send!",
        ephemeral: true,
      });

    const selectedUserStoredBal = await client.fetchBal(
      selectedUser.id,
      interaction.guild.id
    );

    amount = await client.toFixedNumber(amount);

    try {
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBal._id,
        },
        {
          balance: await client.toFixedNumber(userStoredBal.balance - amount),
        }
      );

      await Balance.findOneAndUpdate(
        {
          _id: selectedUserStoredBal._id,
        },
        {
          balance: await client.toFixedNumber(
            selectedUserStoredBal.balance + amount
          ),
        }
      );

      const embed = new EmbedBuilder()
        .setTitle("Zoin sent!")
        .setDescription(`You sent ${amount} zoins to ${selectedUser.tag}!`)
        .setColor("#7d5fff")
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log({
        message: `[Z!NC pay] Error`,
        error: err,
        level: "error",
      });
    }
  },
};
