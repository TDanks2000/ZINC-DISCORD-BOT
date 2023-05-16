const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kato")
    .setDescription("use me and find out"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`kato.to`)
      .setImage(`https://kato.to/iconn.png`)
      .setURL(`https://kato.to/`)
      .setDescription(
        "Kato is the first free anime streaming website with Ai-Tools where you can watch English Subbed and Dubbed anime online. WATCH NOW! No Ads GUARANTEED! "
      )
      .setColor("#f1326d")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL:
          "https://cdn.discordapp.com/icons/1103648971668344896/22d2d198645c76e9c381e87005ed2bc8.webp",
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
