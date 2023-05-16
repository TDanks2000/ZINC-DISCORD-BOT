const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pfp")
    .setDescription("displays your profile picture")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("the user you want to see the profile picture of")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s profile picture`)
      .setImage(avatar)
      .setColor("Random");

    return interaction.reply({ embeds: [embed] });
  },
};
