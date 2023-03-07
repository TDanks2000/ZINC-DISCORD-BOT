const { Schema, model } = require("mongoose");

const guidSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  guildIcon: { type: String, required: false },
});

module.exports = model("Guild", guidSchema, "guilds");
