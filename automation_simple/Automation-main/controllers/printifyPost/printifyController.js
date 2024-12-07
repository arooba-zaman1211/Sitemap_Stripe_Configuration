const axios = require("axios");
const token2 = process.env.PRINTIFY_ACCESS_TOKEN;

const uploadImageToPrintify = async (fileName, base64Image, token) => {
  try {
    console.log("1");
    const response = await axios.post(
      "https://api.printify.com/v1/uploads/images.json",
      { file_name: fileName, contents: base64Image },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token2}`,
        },
      }
    );
    console.log("2");
    return response.data.id;
  } catch (error) {
    console.error("Error uploading image to Printify:", error);
    throw error;
  }
};

module.exports = { uploadImageToPrintify };
