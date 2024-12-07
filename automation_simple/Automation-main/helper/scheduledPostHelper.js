const {
  postToInsta,
} = require("../controllers/instagrampost/instaController.js");
const postsSchema = require("../models/instaPost.js");
const moment = require("moment-timezone");
const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;
const parents_key = process.env.PARENTS_KEY;
const SCOPE = ["https://www.googleapis.com/auth/drive"];

const dotenv = require("dotenv");
const { google } = require("googleapis");

const checkForScheduledPosts = async () => {
  try {
    const currentTimePKT = moment().tz("Asia/Karachi");
    const currentTimeUTC = currentTimePKT.utc().startOf("second").toDate();

    const postsToPost = await postsSchema.find({
      status: "processed",
      $expr: {
        $lte: [
          { $dateTrunc: { date: "$date_time", unit: "second" } },
          currentTimeUTC,
        ],
      },
      images: { $not: { $size: 0 } },
    });

    if (postsToPost.length === 0) {
      console.log("No posts to process.");
      return { success: true };
    }

    let allPostsPosted = true;

    for (let post of postsToPost) {
      try {
        console.log(`Updating status of post ${post._id} to 'posting'`);
        post.status = "posting";
        await post.save();

        const response = await postToInsta({
          caption: post.caption,
          image_urls: post.images,
        });

        console.log(
          `Response for post ${post._id}: ${JSON.stringify(response)}`
        );

        if (response.status === 200 && post.images.length > 0) {
          console.log(`Post ${post._id} successfully posted.`);
          post.status = "posted";
          await post.save();

          const fileUrl = post.to_delete;
          const fileId = extractFileIdFromUrl(fileUrl);

          await deleteImageFromDrive(fileId);

          await postsSchema.findByIdAndDelete(post._id);
          console.log(`Post ${post._id} deleted.`);
        } else {
          console.error(
            `Failed to post with ID ${post._id}: Received status ${response.status}`
          );
          post.status = "pending";
          post.images = [];
          await post.save();
          allPostsPosted = false;
        }
      } catch (error) {
        console.error(`Failed to post with ID ${post._id}:`, error.message);
        post.status = "pending";
        post.images = [];
        await post.save();
        allPostsPosted = false;
      }
    }

    return { success: allPostsPosted };
  } catch (error) {
    console.error("Error posting scheduled posts:", error.message);
    return { success: false };
  }
};

const extractFileIdFromUrl = (url) => {
  const match = url.match(/id=([^&]+)/);
  return match ? match[1] : null;
};

const deleteImageFromDrive = async (fileId) => {
  const jwtClient = new google.auth.JWT(client_email, null, private_key, SCOPE);
  await jwtClient.authorize();

  const drive = google.drive({ version: "v3", auth: jwtClient });

  try {
    await drive.files.delete({
      fileId: fileId,
    });
    console.log(`File with ID ${fileId} deleted from Google Drive.`);
  } catch (error) {
    console.error("Error deleting file from Google Drive:", error.message);
  }
};

module.exports = { checkForScheduledPosts };
