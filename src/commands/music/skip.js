const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip the current song"),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return await interaction.reply({
        content: "You need to be in a voice channel to skip the song!",
        ephemeral: true,
      });

    if (!queue)
      return await interaction.reply({
        content: "There is no song that I could skip!",
        ephemeral: true,
      });

    if (queue.songs.length === 1) {
      client.distube.stop(interaction.guildId);
      return await interaction.reply({
        content: "Stopped the music!",
      });
    }

    client.distube.skip(interaction.guildId);
    return await interaction.reply({
      content: "Skipped the song!",
    });
  },
};
