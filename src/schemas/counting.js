const { Schema, model } = require("mongoose");

const countingSchema = new Schema({
  guildId: String,
  channel: String,
  count: Number,
  lastPerson: String,
});

module.exports = model("counting", countingSchema);
