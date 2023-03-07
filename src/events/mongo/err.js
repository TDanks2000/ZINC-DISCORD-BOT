const chalk = require("chalk");

module.exports = {
  name: "err",
  async execute(err) {
    console.log(chalk.red(`[MongoDB] an error occurred\n ${err}`));
  },
};
