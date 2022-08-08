const mongoose = require("mongoose");

async function connect() {
  try {
    const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rf0dtjh.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(url, { useNewUrlParser: true });
  } catch (error) {
    console.log("Error while connecting to MongoDB\n", error);
  }
}

module.exports = { connect };
