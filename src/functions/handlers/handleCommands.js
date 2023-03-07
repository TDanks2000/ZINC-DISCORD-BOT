const { REST } = require("@discordjs/rest");
const chalk = require("chalk");
const { Routes } = require("discord.js");
const fs = require("node:fs");

const TOKEN = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_TESTING;

module.exports = (client) => {
  client.handleCommands = async (commandFolders, path) => {
    client.commandArray = [];

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        if (!command?.data?.name) return;
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    (async () => {
      try {
        console.log(
          chalk.cyan(`[Z!NC] Started refreshing application (/) commands.`)
        );

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: client.commandArray,
        });

        console.log(
          chalk.green(`[Z!NC] Successfully reloaded application (/) commands.`)
        );
      } catch (error) {
        console.error(error);
      }
    })();
  };
};
