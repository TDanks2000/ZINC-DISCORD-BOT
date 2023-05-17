const { EmbedBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription(
      "returns a random nsfw image. or if specified, a specific nsfw image."
    )
    .addStringOption((option) =>
      option
        .setName("nsfw_type")
        .setDescription("The type of nsfw image you want to get.")
        .setAutocomplete(true)
    ),
  async autocomplete(interaction, client) {
    if (!interaction.channel.nsfw) return;
    const focusedValue = interaction.options.getFocused()?.toLowerCase();

    const choices = [
      "hass",
      "hmidriff",
      "pgif",
      "4k",
      "hentai",
      "holo",
      "hneko",
      "neko",
      "hkitsune",
      "kemonomimi",
      "anal",
      "hanal",
      "gonewild",
      "kanna",
      "ass",
      "pussy",
      "thigh",
      "hthigh",
      "paizuri",
      "tentacle",
      "boobs",
      "hboobs",
      "yaoi",
    ];
    const filtered = choices.filter((choice) =>
      choice?.toLowerCase().includes(focusedValue)
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    if (!interaction.channel.nsfw)
      return interaction.reply({
        content: `**CHANNEL IS NOT NSFW**`,
        ephemeral: true,
      });

    const nsfw_type = interaction.options.getString("nsfw_type");

    const data = await client.getNsfwImage(nsfw_type);

    if (!data) return await interaction.reply(`there was an error`);

    const embed = new EmbedBuilder()
      .setTitle(
        `[${client.user.username}] ${data.type.toUpperCase()} NSFW || ${
          interaction.user.username
        } requested this.`
      )
      .setColor(data.color ?? client.color)
      .setImage(data.url)
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
