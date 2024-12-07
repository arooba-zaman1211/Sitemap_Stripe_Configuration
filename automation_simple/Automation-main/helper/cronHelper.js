const tokenHelper = require("./tokenHelper");

async function checkTokenAndRefresh() {
  console.log("Running initial token expiration check");

  try {
    const isNearExpiration = await tokenHelper.isTokenNearExpiration(12);

    if (isNearExpiration) {
      console.log("Token is expiring soon. Fetching a new token...");
      await tokenHelper.fetchAndSaveToken();
      console.log("Token refreshed successfully");
    } else {
      console.log("Token is still valid");
    }
  } catch (error) {
    console.error("Error in token expiration check:", error);
  }
}

module.exports = { checkTokenAndRefresh };
