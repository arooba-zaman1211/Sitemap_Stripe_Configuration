const IG_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const axios = require("axios");
const db = require("../../models/tokens");

require("dotenv").config();

const postToInsta = async ({ caption, image_urls }) => {
  try {
    console.log(caption);
    console.log(image_urls);
    console.log("post 1");
    const tokenRecord = await db.findOne();
    if (!tokenRecord) {
      throw new Error("Instagram token not found in database");
    }
    const IG_Token = tokenRecord.token;
    console.log("post 2");
    const mediaIds = [];
    for (const image_url of image_urls) {
      const mediaUploadResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${IG_ID}/media`,
        {
          image_url,
          media_type: "IMAGE",
          is_carousel_item: true,
          access_token: IG_Token,
        }
      );

      mediaIds.push(mediaUploadResponse.data.id);
    }

    const carouselPostResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${IG_ID}/media`,
      {
        caption,
        media_type: "CAROUSEL",
        children: mediaIds,
        access_token: IG_Token,
      }
    );

    const carouselMediaId = carouselPostResponse.data.id;
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${IG_ID}/media_publish`,
      {
        creation_id: carouselMediaId,
        access_token: IG_Token,
      }
    );
    return { status: 200, data: publishResponse.data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

module.exports = { postToInsta };
