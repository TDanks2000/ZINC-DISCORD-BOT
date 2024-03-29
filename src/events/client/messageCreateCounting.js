const chalk = require("chalk");
const countingSchema = require("../../schemas/counting");
const { Client } = require("discord.js");
const { Message } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
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

    if (!data) return;

    const list = [
      ` <USER> Is stupid and ruined it at **${data.count}**`,
      `What the *BEEP* you *BEEP* <USER> Ruined it at **${data.count}**`,
      `<USER> has RUINED! RUINED! RUINED! it at  **${data.count}** `,
      `<USER> has RUINED it at **${data.count}**`,
      `what where you thinking <USER>! you ruined it at **${data.count}**`,
      `omg its all gone to *BEEP* we can't have anything nice omg, you have actually ruined all this hard work  <USER> at **${data.count}**`,
    ];

    if (message.channel.id === data.channel) {
      if (
        message.author.id == data.lastPerson ||
        message.content < data.count ||
        message.content > data.count
      ) {
        const randomItem = list[
          Math.floor(Math.random() * list.length)
        ].replace("<USER>", `<@${message.author.id}>`);

        data.count = 1;
        data.lastPerson = "";
        data.save();

        const embed = new EmbedBuilder()
          .setTitle("Counting")
          .setColor("Red")
          .setDescription(randomItem)
          .setTimestamp();

        const msg = await message.channel.send({ embeds: [embed] });

        await msg.react("😡");

        return await message.react("❌");
      }

      if (message.content == 100 && data.count == 100) message.react("💯");
      else message.react("✅");

      data.count++;
      data.lastPerson = message.author.id;
      data.save();
    }
  },
};
