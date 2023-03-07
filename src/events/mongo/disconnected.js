const chalk = require("chalk");

module.exports = {
  name: "disconnected",
  async execute() {
    console.log(chalk.red("[MongoDB] Disconnected from MongoDB"));
  },
};
