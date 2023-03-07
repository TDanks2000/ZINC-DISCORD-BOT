const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Returns the balance of the user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get the balance of.")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("target") || interaction.user;
    const bal = await client.getBal(user.id, interaction.guild.id);
  },
};
