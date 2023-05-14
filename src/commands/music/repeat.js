const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("repeat the current song or queue"),
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
        content: "There is no song that I could set the volume for!",
        ephemeral: true,
      });

    queue.setVolume(interaction.options.get("volume").value);

    return interaction.reply({
      content: `The volume has been set to ${
        interaction.options.get("volume").value
      }`,
      ephemeral: true,
    });
  },
};
