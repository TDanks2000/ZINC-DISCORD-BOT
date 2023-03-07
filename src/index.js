require("dotenv").config();

const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const connectToMongoDB = require("./utils/mongoDBConnect");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.CLIENT_TOKEN;

client.commands = new Collection();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandsFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }

  await client.handleEvents(eventFiles, "./src/events");
  await client.handleCommands(commandsFolders, "./src/commands");
  await client.login(TOKEN);

  await connectToMongoDB();
})();
