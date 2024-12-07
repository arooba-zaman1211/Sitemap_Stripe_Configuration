const express = require("express");
const router = express.Router();
const { checkForPendingPosts } = require("../helper/changeStreamHandler");

router.get("/check-for-pending-posts", async (req, res) => {
  console.log("Triggered check for pending posts");
  const { status, message } = await checkForPendingPosts();
  res.status(status).send(message);
});

module.exports = router;
