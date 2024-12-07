const mongoose = require("mongoose");
const { checkForScheduledPosts } = require("../helper/scheduledPostHelper.js");
require("dotenv").config();

const connection_string = process.env.CONNECTION_STRING;
const RETRY_INTERVAL = 10000;

const connectDB = async () => {
  while (true) {
    try {
      await mongoose.connect(connection_string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");

      checkForScheduledPosts();
      break;
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);

      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      console.log("Retrying MongoDB connection...");
    }
  }
};

module.exports = connectDB;
