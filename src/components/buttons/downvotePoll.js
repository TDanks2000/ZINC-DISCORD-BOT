const {
  Client,
  Interaction,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const pollSchema = require("../../schemas/votes");

module.exports = {
  data: {
    name: "downvotePoll",
  },
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const data = await pollSchema.findOne({
      Guild: interaction.guild.id,
      Msg: interaction.message.id,
    });

    if (!data) return;

    if (data.DownMembers.includes(interaction.user.id))
      return interaction.reply({
        content: "You already voted for this poll!",
        ephemeral: true,
      });

    const msg = await interaction.channel.messages.fetch(data.Msg);

    let upvotes = data.Upvotes;
    if (data.UpMembers.includes(interaction.user.id)) {
      upvotes = upvotes - 1;
    }

    const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: "✅ Yes",
        value: `${upvotes}`,
        inline: true,
      },
      { name: "❌ No", value: `${data.Downvotes + 1}`, inline: true }
    );

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

    await interaction.update({
      embeds: [newEmbed],
      components: [buttons],
    });

    data.Downvotes++;

    if (data.UpMembers.includes(interaction.user.id)) {
      data.Upvotes = data.Upvotes - 1;
    }

    data.DownMembers.push(interaction.user.id);
    data.UpMembers.pull(interaction.user.id);
    await data.save();
  },
};
