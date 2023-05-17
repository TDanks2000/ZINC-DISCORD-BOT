const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Interaction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("animal")
    .setDescription("Get a random picture and fact about an animal")
    .addStringOption((option) =>
      option
        .setName("animal_name")
        .setDescription("The name of the animal")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused()?.toLowerCase();

    const choices = [
      "Dog",
      "Cat",
      "Koala",
      "Panda",
      "Red panda",
      "Bird",
      "Raccoon",
      "Kangaroo",
    ];
    const filtered = choices.filter((choice) =>
      choice?.toLowerCase().includes(focusedValue)
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    const animal_name = interaction.options
      .getString("animal_name")
      .replace(" ", "_");

    const api = axios.create({ baseURL: "https://some-random-api.com/animal" });
    const { data } = await api.get(`/${animal_name}`);

    const embed = new EmbedBuilder()
      .setTitle(animal_name)
      .setColor(client.color)
      .setImage(data.image)
      .setDescription(data.fact)
      .setTimestamp();

    return await interaction.reply({
      embeds: [embed],
    });
  },
};
