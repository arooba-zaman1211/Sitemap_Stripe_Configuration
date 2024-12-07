const express = require("express");
const { postToInsta } = require("../controllers/instagrampost/instaController");
const router = express.Router();

router.post("/post-to-insta", async (req, res) => {
  const { caption, image_urls } = req.body;

  if (!caption || !image_urls || !Array.isArray(image_urls)) {
    return res.status(400).json({
      error: "Invalid input. Provide caption and an array of image URLs.",
    });
  }

  try {
    console.log("1");
    const result = await postToInsta({ caption, image_urls });
    console.log("2");
    res.status(result.status).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to post to Instagram", details: error.message });
  }
});

module.exports = router;
