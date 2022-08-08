const axios = require("axios");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const urlcat = require("urlcat").default;

const PORT = 3003 || 3004;
const baseURL = `http://localhost:${PORT}/api/game`;
const API = axios.create({ baseURL: baseURL });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cs")
    .setDescription("get the crack status of a game")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The name of the game to check")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const game = await interaction.options.getString("game");

    const searchURL = urlcat("http://localhost:3003", "/api/game/search", {
      search: game,
      limit: 7,
    });
    const { data: searchData } = await axios.get(searchURL);
    // return console.log(data);

    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select_Game")
        .setPlaceholder("No game selected")
        .addOptions(
          searchData.map((r) => ({
            label: r.name,
            description: `${r.summary.split(".")[0].substring(0, 95)}...`,
            value: r.name,
          }))
        )
    );

    const msg = await interaction.reply({
      content: "Please select a game!",
      components: [row],
    });

    const col = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 10000,
    });

    await col.on("collect", async (i) => {
      let Name = i.values[0].toLowerCase().includes("dying light 2:")
        ? i.values[0].split(":")[0]
        : i.values[0];
      const data = await fetcher(decodeURI(Name));

      const Embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .addFields({
          name: "*crackStatus*".toUpperCase(),
          value: data.result ? "``cracked``" : "``uncracked``",
          inline: true,
        })
        .setTitle(Name)
        .setThumbnail(data.Info ? data.Info.full_image : null);

      i.update({
        embeds: [Embed],
        ephemeral: false,
        components: [],
      });
      col.stop();
    });

    // if (interaction.isSelectMenu("select_Game")) {
    //   interaction.deleteReply();
    // }

    return false;

    if (data) {
      return await interaction.reply({
        content: `${game} is cracked!`,
        ephemeral: false,
      });
    }

    if (!data) {
      return await interaction.reply({
        content: `${game} is not cracked!`,
        ephemeral: false,
      });
    }

    return await interaction.reply({
      content: `${game} is not cracked! or there was an error`,
      ephemeral: false,
    });
  },
};

const fetcher = async (query) => {
  const { data } = await API.post("/crack/search", {
    s: query,
  });
  return data;
};
