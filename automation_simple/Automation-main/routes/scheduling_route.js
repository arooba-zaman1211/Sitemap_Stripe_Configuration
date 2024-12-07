const express = require("express");
const router = express.Router();
const { checkForScheduledPosts } = require("../helper/scheduledPostHelper");
const { checkTokenAndRefresh } = require("../helper/cronHelper");

router.get("/check-for-scheduled-posts", async (req, res) => {
  console.log("Triggered check for scheduled posts ");

  try {
    const result = await checkForScheduledPosts();

    await checkTokenAndRefresh();

    if (result.success) {
      res
        .status(200)
        .send("Scheduled posts processed and published successfully.");
    } else {
      res.status(500).send("Some posts failed to post.");
    }
  } catch (error) {
    console.error("Error while checking scheduled posts:", error);
    res.status(500).send("An error occurred while processing scheduled posts.");
  }
});

module.exports = router;
