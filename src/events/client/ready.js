const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(chalk.green`[Z!NC] Ready! Logged in as ${client.user.tag}`);
  },
};
