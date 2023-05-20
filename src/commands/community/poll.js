const {
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
  Interaction,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

const pollSchema = require("../../schemas/votes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("creates a poll")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setRequired(true)
        .setDescription("topic of the poll")
        .setMinLength(3)
        .setMaxLength(1000)
    ),
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const topic = await interaction.options.getString("topic");

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle("📌 Poll started")
      .setDescription(`> ${topic}`)
      .addFields({ name: "✅ Yes", value: "0", inline: true })
      .addFields({ name: "❌ No", value: "0", inline: true })
      .setFooter({
        text: `Started by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("upvotePoll")
        .setLabel("✅")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("downvotePoll")
        .setLabel("❌")
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await interaction.channel.send({
      embeds: [embed],
      components: [buttons],
    });

    msg.createMessageComponentCollector();

    await pollSchema.create({
      Msg: msg.id,
      UpMembers: [],
      DownMembers: [],
      Upvotes: 0,
      Downvotes: 0,
      Owner: interaction.user.id,
      Guild: interaction.guild.id,
    });
  },
};
