const chalk = require("chalk");
const countingSchema = require("../../schemas/counting");
const { Client } = require("discord.js");
const { Message } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageDelete",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns
   */
  async execute(message, client) {
    const guildId = message.guild.id;

    if (message.author.bot) return;

    if (isNaN(message.content)) return;

    const data = await countingSchema.findOne({ guildId });

    if (!data || !data.channel) return;

    if (message.channel.id !== data.channel) return;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `**Watch Out** ${message.author} counted and then deleted a message! \n the  number is ${message.content} `
      )
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });
  },
};
