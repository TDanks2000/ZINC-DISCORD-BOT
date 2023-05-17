const { Client, Interaction } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const yts = require("yt-search");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song you want to play")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async autocomplete(interaction, client) {
    try {
      const focusedValue = interaction.options.getFocused()?.toLowerCase();

      if (focusedValue.startsWith("https://") || focusedValue?.length < 1)
        return await interaction.respond({
          name: focusedValue,
          value: focusedValue,
        });

      let results = await yts(focusedValue).catch(() => null);

      if (!results?.all || results?.all?.length < 1)
        return await interaction.respond({
          name: focusedValue,
          value: focusedValue,
        });

      results = results.videos?.slice(0, 25);

      await interaction.respond(
        results.map((choice) => ({
          name:
            choice?.title?.replace(/[^a-zA-Z ]/g, "")?.slice(0, 50) ??
            focusedValue?.slice(0, 10),
          value: choice?.url ?? focusedValue,
        }))
      );
    } catch (error) {
      console.log({
        time: new Date().toLocaleString(),
        command: "play",
        type: "autocomplete",
        error: error.message,
      });
    }
  },
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
