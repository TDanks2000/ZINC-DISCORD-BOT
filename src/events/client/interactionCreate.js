const { Client, Interaction, InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      const { commands } = client;
      const { commandName } = interaction;

      const command = commands.get(commandName);

      if (!command) return;

      try {
        await command.autocomplete(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }

    if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;

      const button = buttons.get(customId);

      if (!button) return;

      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
  },
};
