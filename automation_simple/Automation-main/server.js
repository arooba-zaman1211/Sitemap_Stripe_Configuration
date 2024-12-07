const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const connectDB = require("./config/dbConnection.js");
const cronHelper = require("./helper/cronHelper.js");
const pending = require("./routes/pending_route.js");
const scheduled = require("./routes/scheduling_route.js");
const instaPost = require("./routes/posttoInsta.js");

app.use(express.json());

const RETRY_INTERVAL = 10000;

async function connectWithRetry() {
  while (true) {
    try {
      await connectDB();
      console.log("Connected to MongoDB");
      break;
    } catch (error) {
      console.error(
        "Failed to connect to MongoDB. Retrying in 10 seconds...",
        error
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}
async function tokenCheckWithRetry() {
  while (true) {
    try {
      await cronHelper.checkTokenAndRefresh();
      console.log("Token check and refresh completed successfully");
      break;
    } catch (error) {
      console.error("Token check failed. Retrying in 10 seconds...", error);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}
async function initializeApp() {
  await connectWithRetry();
  await tokenCheckWithRetry();
}
app.use("/api", pending);
app.use("/api", scheduled);
app.use("/api", instaPost);

app.get("/", (req, res) => {
  console.log("enter1");
  res.send("API is running!");
});

const PORT = 3000;
initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// To be removedconst fs = require("fs");
const path = require("path");
const fs = require("fs");
const { NymPostone } = require("./services/nymPost_1.jsx");

const black4oz = new NymPostone({
  width: 3531,
  height: 2352,
  nymFontSize: "520px",
  nymLineHeight: "604.76px",
  definitionFontSize: "240px",
  definitionLineHeight: "281.76px",
  Nym: "Hi I am Nat",
  Definition: "short for natural disaster",
  NymColor: "#FFFFFF",
  formatNym: false,
  nymTop: 265,
  definitionTop: 904,
  left: 135,
  nymWidth: 3263,
  nymHeight: 558,
  definitionWidth: 3263,
  definitionHeight: 241,
  distanceBetweenTexts: 20,
});

async function saveBlackImage() {
  try {
    // Generate the image using the build() method and specify the format
    const blackImageBuffer = await black4oz.build({ format: "png" });

    // Generate a unique file name
    const blackFileName = "black-image2.png"; // You can replace this with your custom function if you need unique names

    // Define the file path where the image will be saved
    const outputPath = path.join(
      __dirname,
      "public",
      "assets",
      "images",
      blackFileName
    );

    // Write the image buffer to the file
    fs.writeFileSync(outputPath, blackImageBuffer);

    console.log("Black image saved to:", outputPath);
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

// Call the function to save the image
saveBlackImage();
