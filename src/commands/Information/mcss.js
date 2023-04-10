const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { status } = require("minecraft-server-util");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mcss")
    .setDescription("Get the status of a Minecraft server!")
    .addStringOption((option) =>
      option
        .setName("server")
        .setDescription("The IP address of the server you want to check!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const server = interaction.options.getString("server");
    try {
      const mcStatus = await status(server, 25565);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `MC Server Status | ${server}`,
          iconURL: "attachment://favicon.png",
        })
        .setColor(client.color)
        .addFields(
          {
            name: "Server IP",
            value: server,
            inline: true,
          },
          {
            name: "Version",
            value: mcStatus.version.name,
            inline: true,
          },
          {
            name: "Online Players",
            value: `${mcStatus.players.online} / ${mcStatus.players.max}`,
            inline: true,
          }
        )
        .setDescription(mcStatus.motd.clean)
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        })
        .setTimestamp();

      return await interaction.reply({
        files: [
          {
            attachment: mcStatus?.favicon
              ? Buffer.from(mcStatus.favicon.split(",")[1], "base64")
              : "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png",
            name: "favicon.png",
          },
        ],
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      interaction.reply("Server is offline!");
    }
  },
};
