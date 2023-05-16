const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kato")
    .setDescription("use me and find out"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(
        `Introducing Kato: Your Ultimate Destination for Anime Streaming`
      )
      .setImage(`https://kato.to/iconn.png`)
      .setURL(`https://kato.to/`)
      .setDescription(
        `
        Are you a devoted anime enthusiast in search of a seamless streaming experience? Look no further than Kato! Unleashing the power of Ai-Tools, Kato revolutionizes your anime-watching journey, offering a vast library of English Subbed and Dubbed anime series. Immerse yourself in captivating storylines, vibrant characters, and enjoy a distraction-free streaming experience. Join the Anime Revolution - start streaming on Kato today!
        
        Features:
          -English Subbed and Dubbed anime series
          -Seamless and intuitive streaming experience
          -Ai-Tools for enhanced convenience
          
        Join Kato now and let your anime obsession soar to new heights!`
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
