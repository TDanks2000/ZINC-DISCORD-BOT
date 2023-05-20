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
    name: "upvotePoll",
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

    if (data.UpMembers.includes(interaction.user.id))
      return interaction.reply({
        content: "You already voted for this poll!",
        ephemeral: true,
      });

    const msg = await interaction.channel.messages.fetch(data.Msg);

    let downvotes = data.Downvotes;
    if (data.DownMembers?.includes(interaction.user.id)) {
      downvotes = downvotes - 1;
    }

    const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: "✅ Yes",
        value: `${data.Upvotes + 1}`,
        inline: true,
      },
      {
        name: "❌ No",
        value: `${downvotes}`,
        inline: true,
      }
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("upvotePoll")
        .setLabel("✅ YES")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("downvotePoll")
        .setLabel("❌ NO")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.update({
      embeds: [newEmbed],
      components: [buttons],
    });

    data.Upvotes++;

    if (data.DownMembers.includes(interaction.user.id)) {
      data.Downvotes = data.Downvotes - 1;
    }

    data.UpMembers.push(interaction.user.id);
    data.DownMembers.pull(interaction.user.id);
    await data.save();
  },
};
