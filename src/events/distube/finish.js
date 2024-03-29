const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");

module.exports = {
  name: "finish",
  async execute(queue, client) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "K!TSUNE MUSIC | Queue finished",
        iconURL:
          "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif",
      })
      .setColor(client.color)
      .setDescription(`The queue has finished!`)
      .setTimestamp();

    return await queue.textChannel.send({
      embeds: [embed],
    });
  },
};
