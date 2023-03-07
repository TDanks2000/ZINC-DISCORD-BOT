require("dotenv").config();

const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const connectToMongoDB = require("./utils/mongoDBConnect");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.CLIENT_TOKEN;

client.commands = new Collection();

const functionFolder = fs.readdirSync("./src/functions");
for (const folder of functionFolder) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandsFolders = fs.readdirSync("./src/commands");

(async () => {
  await client.handleEvents(eventFiles, "./src/events");
  await client.handleCommands(commandsFolders, "./src/commands");
  await client.login(TOKEN);

  await connectToMongoDB();
})();
