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
        .addChoices(
          { name: "hass", value: "hass" },
          { name: "hmidriff", value: "hmidriff" },
          { name: "pgif", value: "pgif" },
          { name: "4k", value: "4k" },
          { name: "hentai", value: "hentai" },
          { name: "holo", value: "holo" },
          { name: "hneko", value: "hneko" },
          { name: "neko", value: "neko" },
          { name: "hkitsune", value: "hkitsune" },
          { name: "kemonomimi", value: "kemonomimi" },
          { name: "anal", value: "anal" },
          { name: "hanal", value: "hanal" },
          { name: "gonewild", value: "gonewild" },
          { name: "kanna", value: "kanna" },
          { name: "ass", value: "ass" },
          { name: "pussy", value: "pussy" },
          { name: "thigh", value: "thigh" },
          { name: "hthigh", value: "hthigh" },
          { name: "paizuri", value: "paizuri" },
          { name: "tentacle", value: "tentacle" },
          { name: "boobs", value: "boobs" },
          { name: "hboobs", value: "hboobs" },
          { name: "yaoi", value: "yaoi" }
        )
    ),
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
      .setColor(data.color)
      .setImage(data.url)
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
