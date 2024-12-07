const fs = require("fs");
const path = require("path");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const apiKeys = require("../ivory-signer-427908-s3-dfab1812d9f2.json");
const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config();

const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;
const parents_key = process.env.PARENTS_KEY;

console.log(client_email);
console.log(private_key);
console.log(parents_key);

async function uploadAndGeneratePublicUrl(filePath) {
  console.log(filePath);
  const jwtClient = new google.auth.JWT(client_email, null, private_key, SCOPE);
  console.log("2");
  await jwtClient.authorize();
  console.log("3");

  const drive = google.drive({ version: "v3", auth: jwtClient });
  console.log("1");
  // Set file metadata
  const fileMetaData = {
    name: path.basename(filePath), // Use the original file name
    parents: [parents_key], // Google Drive folder ID
  };
  console.log("4");
  const media = {
    mimeType: "image/jpeg", // Image MIME type
    body: fs.createReadStream(filePath), // Read file stream
  };
  console.log("5");
  // Upload the file
  const response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: "id", // Only return the file ID
  });

  console.log("6");
  const fileId = response.data.id;
  console.log(fileId);

  // Make the file public
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: "reader",
      type: "anyone", // Anyone can view the file
    },
  });

  console.log("7");
  const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0`;
  console.log(url);
  // Return the formatted public URL
  return url;
}

module.exports = { uploadAndGeneratePublicUrl };
