require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  is_public: Boolean,
  last_updated: Date,
});

const User = mongoose.model("users", UserSchema);

app.use(cors());
app.use(express.json());

app.get("/sitemap-data", async (req, res) => {
  try {
    const users = await User.find({ is_public: true }, "username last_updated");

    res.json(
      users.map((user) => ({
        loc: `https://yourwebsite.com/user/${user.username}`,
        lastmod: user.last_updated.toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching sitemap data" });
  }
});

app.listen(PORT, () => {
  console.log(`Sitemap API running on http://localhost:${PORT}`);
});
