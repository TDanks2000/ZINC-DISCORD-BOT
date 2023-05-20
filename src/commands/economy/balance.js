const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Returns the balance of the user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get the balance of.")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const bal = await client.getBal(user.id, interaction.guild.id);

    if (!bal) {
      return interaction.reply({
        content: `**${user.tag}** doesn't have a balance yet.`,
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(`**Balance:** ${bal.balance} Koins.`)
        .setColor("#7d5fff")
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
