const chalk = require("chalk");
const { Client, ActivityType } = require("discord.js");
const { status } = require("minecraft-server-util");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    await client.user.setPresence({
      activities: [{ name: "YOU!", type: ActivityType.Watching }],
      status: "dnd",
    });

    console.log(chalk.green`[K!TSUNE] Ready! Logged in as ${client.user.tag}`);
  },
};
