const { default: axios } = require("axios");

const supportedTypes = [
  "hass",
  "hmidriff",
  "pgif",
  "4k",
  "hentai",
  "holo",
  "hneko",
  "neko",
  "hkitsune",
  "kemonomimi",
  "anal",
  "hanal",
  "gonewild",
  "kanna",
  "ass",
  "pussy",
  "thigh",
  "hthigh",
  "gah",
  "coffee",
  "food",
  "paizuri",
  "tentacle",
  "boobs",
  "hboobs",
  "yaoi",
];

const mapOutData = async (data) => {
  return {
    type: data.nsfwType,
    url: data.message,
    color: data.color,
  };
};

module.exports = (client) => {
  client.getNsfwImage = async (nsfw_type) => {
    if (!nsfw_type) {
      const supportedLength = supportedTypes.length;

      const selected =
        supportedTypes[Math.floor(Math.random() * supportedLength - 1)];

      const { data } = await axios.get(
        `https://nekobot.xyz/api/image?type=${selected}`
      );

      return await mapOutData({ ...data, nsfwType: selected });
    }

    const { data } = await axios.get(
      `https://nekobot.xyz/api/image?type=${nsfw_type}`
    );

    if (data.success !== true || !data) return false;

    return await mapOutData({ ...data, nsfwType: nsfw_type });
  };
};
