const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("pause the current song"),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return await interaction.reply({
        content: "You need to be in a voice channel to pause the song!",
        ephemeral: true,
      });

    if (!queue)
      return await interaction.reply({
        content: "There is no song that I could pause!",
        ephemeral: true,
      });

    client.distube.pause(interaction.guildId);
    return await interaction.reply({
      content: "Paused the music!",
    });
  },
};
