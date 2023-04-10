const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music"),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return await interaction.reply({
        content: "You need to be in a voice channel to stop music!",
        ephemeral: true,
      });

    if (!queue)
      return await interaction.reply({
        content: "There is no music playing!",
        ephemeral: true,
      });

    client.distube.stop(interaction.guildId);
    return await interaction.reply({
      content: "Stopped the music!",
    });
  },
};
