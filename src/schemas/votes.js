const { model, Schema } = require("mongoose");

const vote = new Schema({
  Guild: String,
  Msg: String,
  UpMembers: Array,
  DownMembers: Array,
  Upvotes: {
    type: Number,
    default: 0,
  },
  Downvotes: {
    type: Number,
    default: 0,
  },
  Owner: String,
});

module.exports = model("vote", vote);
