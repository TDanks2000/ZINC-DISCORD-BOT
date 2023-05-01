const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(duration);
dayjs.extend(relativeTime);
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction, client) {
    const data = await client.pingStats();
    const uptime = dayjs.duration(client.uptime).humanize();

    const embed = new EmbedBuilder()
      .setTitle("🏓 PONG!")
      .setColor(client.color)
      .addFields(
        {
          name: "Api Latency",
          value: `${data.apiLatency}ms`,
          inline: true,
        },
        {
          name: "Client Latency",
          value: `${Date.now() - new Date(interaction.createdTimestamp)}ms`,
          inline: true,
        },
        {
          name: "Memory Usage",
          value: `${client.toFixedNumber(data.memoryUsage)}mb`,
          inline: true,
        }
      )
      .setFooter({
        text: `Up for  ${uptime}`,
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // await interaction.reply(
    //   `🏓 Latency is ${
    //     Date.now() - new Date(interaction.createdTimestamp)
    //   }ms. \n    API Latency is ${Math.round(client.ws.ping)}ms`
    // );
  },
};
