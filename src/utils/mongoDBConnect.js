const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

const connectToMongoDB = async () => {
  if (!MONGODB_URL) return console.error("MONGODB_URL is not defined");

  await mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectToMongoDB;
