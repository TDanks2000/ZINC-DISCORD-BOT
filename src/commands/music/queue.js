const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the queue"),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.reply({
        content: "There is no queue!",
        ephemeral: true,
      });

    const progressBar = client.distube.progressBar(
      queue.currentTime,
      queue.songs[0].duration,
      20
    );

    const queueEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Z!NC MUSIC | QUEUE",
        iconURL:
          "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif",
      })
      .setColor(client.color)
      .addFields(
        queue.songs.slice(0, 5).map((song, index) => {
          return {
            name: `${index + 1}. ${song.name}`,
            value: `Requested by: ${song.user}`,
          };
        })
      )
      .addFields(
        {
          name: "Total songs",
          value: queue.songs.length.toString(),
          inline: true,
        },
        {
          name: "Total duration",
          value: queue.formattedDuration,
          inline: true,
        },
        {
          name: "DURATION",
          value: `${progressBar.Bar} \`${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}\``,
        }
      )
      .setThumbnail(queue.songs[0].thumbnail)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    return await interaction.reply({
      embeds: [queueEmbed],
    });
  },
};
