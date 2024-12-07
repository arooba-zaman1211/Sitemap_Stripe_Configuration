const postsSchema = require("../models/instaPost");
const {
  createAndUploadImage,
} = require("../controllers/products/productController");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processPost(post) {
  let responseStatus = 500; // Default to error in case something fails
  let responseMessage = "Failed to process post due to an unexpected error.";

  try {
    console.log(`Processing post with ID: ${post._id}`);
    const req = { body: post };

    const res = {
      status: (code) => {
        responseStatus = code;
        return {
          send: (message) => {
            responseMessage = message;
            console.log(`Response status: ${code}, message: ${message}`);
          },
        };
      },
    };

    await createAndUploadImage(req, res);
    console.log("Response status:", responseStatus);

    if (responseStatus === 400 || responseStatus === 500) {
      console.log("Error encountered, updating status to 'pending'.");
      post.status = "pending";

      const savedPost = await post.save();
      console.log("Post saved:", savedPost);
    } else if (responseStatus === 200) {
      console.log(`Post with ID ${post._id} processed successfully.`);
    }
  } catch (error) {
    responseMessage = `Failed to process post with ID ${post._id}: ${error.message}`;
    post.status = "pending";

    const savedPost = await post.save();
    console.log("Post saved:", savedPost);
    console.error(responseMessage);
  }

  return { responseStatus, responseMessage };
}

async function checkForPendingPosts() {
  try {
    const processingPost = await postsSchema.findOne({ status: "processing" });
    if (processingPost) {
      console.log("A post is already being processed. Skipping this cycle.");
      return {
        status: 429,
        message: "Another post is currently being processed.",
      };
    }

    const post = await postsSchema.findOneAndUpdate(
      { status: "pending" },
      { status: "processing" },
      { new: true }
    );

    if (post) {
      const { responseStatus, responseMessage } = await processPost(post);
      return { status: responseStatus, message: responseMessage };
    } else {
      console.log("No pending posts found.");
      return { status: 200, message: "No pending posts found." };
    }
  } catch (error) {
    console.error("Error checking for pending posts:", error.message);
    return { status: 500, message: "Error checking for pending posts." };
  }
}

module.exports = { checkForPendingPosts };
