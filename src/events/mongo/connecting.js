const chalk = require("chalk");

module.exports = {
  name: "Connecting",
  async execute() {
    console.log(chalk.cyan("[MongoDB] connecting to MongoDB..."));
  },
};
