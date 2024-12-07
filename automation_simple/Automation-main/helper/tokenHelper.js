const axios = require("axios");
const Token = require("../models/tokens");
const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;

require("dotenv").config();

async function fetchAndSaveToken() {
  try {
    const tokenRecord = await Token.findOne();
    if (!tokenRecord) throw new Error("Previous token not found in database");

    const previousToken = tokenRecord.token;

    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${previousToken}`
    );
    const { access_token, expires_in } = response.data;

    const expirationDate = new Date(Date.now() + expires_in * 1000);

    await Token.findOneAndUpdate(
      { _id: tokenRecord._id },
      { token: access_token, expirationDate: expirationDate },
      { new: true }
    );

    return { token: access_token, expirationDate };
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}

async function isTokenNearExpiration(thresholdHours = 12) {
  const tokenRecord = await Token.findOne();

  if (!tokenRecord) return true;

  const expirationDate = new Date(tokenRecord.expirationDate);
  const now = new Date();
  const hoursRemaining = (expirationDate - now) / (1000 * 60 * 60);

  return hoursRemaining < thresholdHours || now >= expirationDate;
}

module.exports = { fetchAndSaveToken, isTokenNearExpiration };
