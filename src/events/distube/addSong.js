const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");

module.exports = {
  name: "addSong",
  async execute(queue, song, client) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "K!TSUNE MUSIC | Added to queue",
        iconURL:
          "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif",
      })
      .setColor(client.color)
      .setDescription(
        `added [${song.name}](${song.url}) to the queue!
        requested by ${song.user}`
      )
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
