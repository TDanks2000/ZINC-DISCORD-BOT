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
    let sorted = await levelData.sort(
      (a, b) => b.level - a.level || b.xp - a.xp
    );

    const userFind = sorted.find((item) => {
      return item.userId === interaction.user.id;
    });

    const userPos = sorted.indexOf(userFind);

    const maxItems = 10;

    const embed = new EmbedBuilder()
      .setTitle(`K!TSUNE | ${interaction.guild.name}'s level leaderboard`)
      .setDescription(
        `${await leaderboard(
          sorted,
          interaction,
          maxItems
        )} \n\n You are currently position **${userPos + 1}**`
      )
      .setColor(client.color)
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
  },
};

const leaderboard = async (items, interaction, maxitems) => {
  const returnData = await Promise.all(
    items.slice(0, maxitems).map(async (data, index) => {
      const member = await interaction.guild.members.fetch(data.userId);

      return `**${index + 1}.** <@${member.user.id}> - Level: ${
        data.level
      } - XP: ${data.xp}`;
    })
  );

  return returnData.join("\n");
};
