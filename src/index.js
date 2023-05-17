require("dotenv").config();

const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const config = require("../config.json");

const connectToMongoDB = require("./utils/mongoDBConnect");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
});

const TOKEN = process.env.CLIENT_TOKEN;

client.color = config.color;
client.commands = new Collection();
client.distube = new DisTube(client, {
  emitNewSongOnly: config.music.emitNewSongOnly ?? true,
  nsfw: config.music.nsfw ?? false,
  plugins: [new SpotifyPlugin()],
  leaveOnStop: config.music.leaveOnStop ?? false,
  leaveOnEmpty: config.music.leaveOnEmpty ?? false,
});

client.distube.progressBar = require("./utils/progressBar.js");

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
