const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction, client) {
    await interaction.reply(
      `🏓Latency is ${
        Date.now() - new Date(interaction.createdTimestamp)
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  },
};
