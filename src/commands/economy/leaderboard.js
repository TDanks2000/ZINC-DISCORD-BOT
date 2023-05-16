const { Client, Interaction } = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const canvacord = require("canvacord");
const Level = require("../../schemas/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("level leaderboard"),
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const levelData = await Level.find({ guildId: interaction.guild.id });

    if (!levelData || !levelData.length)
      return await interaction.reply({
        content: "No data found",
        ephemeral: true,
      });

    // sort levelData by level
    let sorted = await levelData.sort((a, b) => b.level - a.level);

    // sort by xp
    sorted = await sorted.sort((a, b) => b.xp - a.xp);

    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setDescription(
        sorted
          .splice(0, 5)
          .map(
            (data, index) =>
              `**${index + 1}.** <@${data.userId}> - Level: ${
                data.level
              } - XP: ${data.xp}`
          )
          .join("\n")
      )
      .setColor(client.color)
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
  },
};
