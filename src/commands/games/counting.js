const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  Client,
  Interaction,
} = require("discord.js");

const countingSchema = require("../../schemas/counting.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counting")
    .setDescription("configure the counting system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("setup the counting system")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("the channel to send the messages")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mute")
        .setDescription("mute the user from the counting game")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to mute")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unmute")
        .setDescription("unmute the user from the counting game")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to unmute")
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId, guild, member } = interaction;
    const subcommand = options.getSubcommand();

    const channel = options.getChannel("channel");
    const user = options.getUser("user");

    const errEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("⛔：Something went wrong")
      .setTimestamp();

    const data = await countingSchema.findOne({ guildId: guildId });
    switch (subcommand) {
      case "setup":
        if (!data) {
          await countingSchema.create({
            guildId: guildId,
            channel: channel.id,
            count: 0,
            lastPerson: "",
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ Setup the counting system in ${channel}`)
            .setTimestamp();

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else if (!data) {
          data.channel = channel.id;
          data.save();

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`ℹ️ changed the counting channel to ${channel}`)
            .setTimestamp();
          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }

        break;

      case "mute":
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `⛔ The counting system is not setup in this server`
            )
            .setTimestamp();

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else if (!data) {
          const ch = await guild.channels.fetch(data.channel);

          await ch.permissionOverwrites.edit(user.id, {
            sendMessages: false,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅  Muted ${user} from the counting game`)
            .setTimestamp()
            .setFooter({
              text: `Muted by ${member.user.tag}`,
              iconURL: member.user.displayAvatarURL(),
            });

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }

        break;
      case "unmute":
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `⛔ The counting system is not setup in this server`
            )
            .setTimestamp();

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else if (!data) {
          const ch = await guild.channels.fetch(data.channel);

          await ch.permissionOverwrites.edit(user.id, {
            sendMessages: true,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅  un-muted ${user} from the counting game`)
            .setTimestamp()
            .setFooter({
              text: `un-muted by ${member.user.tag}`,
              iconURL: member.user.displayAvatarURL(),
            });

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }

        break;
    }
  },
};
