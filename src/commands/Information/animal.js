const { default: axios } = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("animal")
    .setDescription("Get a random picture and fact about an animal")
    .addStringOption((option) =>
      option
        .setName("animal_name")
        .setDescription("The name of the animal")
        .setRequired(true)
        .addChoices(
          { name: "Dog", value: "Dog" },
          { name: "Cat", value: "Cat" },
          { name: "Koala", value: "Koala" },
          { name: "Panda", value: "Panda" },
          { name: "Red panda", value: "Red panda" },
          { name: "Bird", value: "Bird" },
          { name: "Raccoon", value: "Raccoon" },
          { name: "Kangaroo", value: "Kangaroo" }
        )
    ),
  async execute(interaction, client) {
    const animal_name = interaction.options
      .getString("animal_name")
      .replace(" ", "_");

    const api = axios.create({ baseURL: "https://some-random-api.ml/animal" });
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
