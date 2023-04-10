const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song you want to play")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const song = interaction.options.getString("song");
    const queue = client.distube.getQueue(interaction.guildId);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return await interaction.reply({
        content: "You need to be in a voice channel to play music!",
        ephemeral: true,
      });

    client.distube.play(voiceChannel, song, {
      message: interaction.message,
      textChannel: interaction.channel,
      member: interaction.member,
    });

    if (queue) {
      return await interaction.reply({
        content: `Added ${song} to the queue!`,
        ephemeral: true,
      });
    }

    return await interaction.reply({
      content: `Playing ${song}!`,
      ephemeral: true,
    });
  },
};
