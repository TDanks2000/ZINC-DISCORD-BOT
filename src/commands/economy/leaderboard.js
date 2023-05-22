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
    const levelData = await Level.find({ guildId: interaction.guild.id })
      .sort({
        xp: -1,
        level: -1,
      })
      .limit(10);

    if (!levelData || !levelData.length)
      return await interaction.reply({
        content: "No data found",
        ephemeral: true,
      });

    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setTitle(`K!TSUNE | ${interaction.guild.name}'s level leaderboard`)
      .setColor(client.color)
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    let text = "";
    for (let c = 0; c < levelData.length; c++) {
      let { userId, xp, level } = levelData[c];
      const value = await interaction.guild.members.fetch(userId);

      let member = `${value.user.username}#${value.user.discriminator}`;

      text += `${c + 1}. ${member} | XP: ${xp} | Level: ${level} \n`;
    }

    embed.setDescription(`\`\`\`${text}\`\`\``);

    return await interaction.editReply({ embeds: [embed] });
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
