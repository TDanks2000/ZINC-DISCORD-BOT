const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");

module.exports = {
  name: "playSong",
  async execute(queue, song, client) {
    console.log(queue.textChannel);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Z!NC MUSIC | Playing",
        iconURL:
          "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif",
      })
      .setColor(client.color)
      .setDescription(`[${song.name}](${song.url})`)
      .addFields({
        name: "Duration",
        value: song.formattedDuration,
        inline: true,
      })
      .setThumbnail(song.thumbnail)
      .setFooter({
        text: `Requested by ${song.user.tag}`,
        iconURL: song.user.displayAvatarURL(),
      })
      .setTimestamp();

    return await queue.textChannel.send({
      embeds: [embed],
    });
  },
};
