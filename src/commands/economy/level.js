const { Client, Interaction } = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const canvacord = require("canvacord");
const Level = require("../../schemas/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("shows your level or someone else's")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get the balance of.")
    ),
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const mentionedUserId = interaction.options.get("user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const member = await interaction.guild.members.fetch(targetUserId);

    const query = {
      userId: member.id,
      guildId: interaction.guild.id,
    };

    const level = await Level.findOne(query);

    const rankCard = new canvacord.Rank()
      .setAvatar(interaction.user.displayAvatarURL({ dynamic: false }))
      .setCurrentXP(level.xp)
      .setRequiredXP(calculateLevelXp(level.level))
      .setStatus(member.presence.status)
      .setProgressBar(client.color, "COLOR")
      .setUsername(interaction.user.username)
      .setDiscriminator(interaction.user.discriminator);

    const data = await rankCard.build();
    const attachment = new AttachmentBuilder(data, {
      name: "rankcard.png",
    });

    await interaction.reply({ files: [attachment] });
  },
};
