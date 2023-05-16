const { Client, Message } = require("discord.js");
const Level = require("../../schemas/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");

const cooldowns = new Map();

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  /**
   *
   * @param {Message} message
   */
  client.giveUserXp = async (message) => {
    if (
      cooldowns.has({
        id: message.author.id,
        guild: message.guild.id,
      })
    )
      return;

    const xpToGive = getRandomXp(5, 15);

    const query = {
      userId: message.author.id,
      guildId: message.guild.id,
    };

    try {
      const level = await Level.findOne(query);

      if (level) {
        level.xp += xpToGive;

        if (level.xp >= calculateLevelXp(level.level)) {
          level.level += 1;
          level.xp = 0;
        }

        await level.save().catch((err) => {
          return console.log(err);
        });

        cooldowns.add({
          id: message.author.id,
          guild: message.guild.id,
        });

        setTimeout(() => {
          cooldowns.delete({
            id: message.author.id,
            guild: message.guild.id,
          });
        }, 60 * 1000);
      }

      // if (!level)
      else {
        const newLevel = new Level({
          userId: message.author.id,
          guildId: message.guild.id,
          xp: xpToGive,
        });

        await newLevel.save().catch((err) => {
          return console.log(err);
        });

        cooldowns.add({
          id: message.author.id,
          guild: message.guild.id,
        });

        setTimeout(() => {
          cooldowns.delete({
            id: message.author.id,
            guild: message.guild.id,
          });
        }, 60 * 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const getRandomXp = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
