require("dotenv").config();
const { createTShirt } = require("../tshirt/tshirtController.js");
const { createHoodie } = require("../hoodie/hoodieController.js");
const { createMug } = require("../mug/mugController.js");
const postsSchema = require("../../models/instaPost.js");
const { createCandle } = require("../candle/candlecontroller.js");
const { NymPosteight } = require("../../services/nymPost_8.jsx");
const { NymPostseven } = require("../../services/nymPost_7.jsx");
const { uploadAndGeneratePublicUrl } = require("../../helper/urlGenerator.js");
const { generateUniqueFileName } = require("../../helper/helper.js");
const fs = require("fs");
const path = require("path");
const shopId = process.env.PRINTIFY_SHOP_ID;
const token = process.env.PRINTIFY_ACCESS_TOKEN;
const axios = require("axios");

const deleteAllProducts = async (productIds) => {
  try {
    for (const productId of productIds) {
      await deleteProduct(productId);
    }
    console.log("All products deleted successfully.");
  } catch (error) {
    console.error("Failed to delete products:", error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    await axios.delete(
      `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(`Product with ID ${productId} deleted successfully.`);
  } catch (error) {
    console.error(
      `Failed to delete product with ID ${productId}:`,
      error.message
    );
  }
};

const createAndUploadImage = async (req, res) => {
  let productIds = [];
  try {
    const name = req.body.text_1;
    const type = req.body.design_id;
    const definition = req.body.text_2;
    const objectId = req.body._id;
    const tags = req.body.tags;
    const product_description = req.body.product_description;

    const tshirt = await createTShirt(
      name,
      type,
      definition,
      tags,
      product_description[0]
    );
    console.log(tshirt);
    if (tshirt.image_url == null) {
      productIds.push(tshirt.productId);
      await deleteAllProducts(productIds);
      return res
        .status(400)
        .send("Error creating and uploading T-shirt image or product");
    }
    const hoodie = await createHoodie(
      name,
      type,
      definition,
      tags,
      product_description[1]
    );
    if (hoodie.image_url === null) {
      productIds.push(hoodie.productId);
      await deleteAllProducts(productIds);
      return res
        .status(400)
        .send("Error creating and uploading Hoodie image or product");
    }
    const mug = await createMug(
      name,
      type,
      definition,
      tags,
      product_description[2]
    );

    if (mug.image_url === null) {
      productIds.push(mug.productId);
      await deleteAllProducts(productIds);
      return res
        .status(400)
        .send("Error creating and uploading Mug image or product");
    }
    const candle = await createCandle(
      name,
      type,
      definition,
      tags,
      product_description[3]
    );
    if (candle.image_url === null) {
      productIds.push(candle.productId);
      await deleteAllProducts(productIds);
      return res
        .status(400)
        .send("Error creating and uploading Candle image or product");
    }

    if (!name || !type || !definition || !tags || !product_description) {
      await postsSchema.updateOne(
        { _id: objectId },
        { $set: { status: "error" } }
      );
      return res.status(400).send("Invalid input data provided.");
    }
    let Card;

    if (type == 1) {
      Card = new NymPostseven({
        width: 1080,
        height: 1080,
        nymFontSize: "207px",
        nymLineHeight: "181px",
        definitionFontSize: "27px",
        definitionLineHeight: "29px",
        Nym: name,
        Definition: definition,
        NymColor: "#000000",
        formatNym: false,
        nymTop: 350,
        definitionTop: 869,
        nymWidth: 1080,
        nymHeight: 333,
        definitionWidth: 787,
        definitionHeight: 65,
        distanceBetweenTexts: 20,
        backgroundImageUrl: "https://i.imgur.com/4pM1pgM.jpeg",
      });
    }
    if (type == 2) {
      Card = new NymPosteight({
        width: 1080,
        height: 1080,
        nymFontSize: "190px",
        nymLineHeight: "161px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 247,
        nymWidth: 1080,
        nymHeight: 630,
        backgroundImageUrl: "https://i.imgur.com/4pM1pgM.jpeg",
      });
    }

    if (type == 3) {
      Card = new NymPosteight({
        width: 1080,
        height: 1080,
        nymFontSize: "207px",
        nymLineHeight: "181px",
        Nym: name,
        NymColor: "#000000",
        formatNym: true,
        top: 179,
        nymWidth: 1080,
        nymHeight: 705,
        backgroundImageUrl: "https://i.imgur.com/4pM1pgM.jpeg",
      });
    }
    console.log(Card);
    if (!Card) {
      return res.status(400).send("Error creating the image card object");
    }

    let blackImage_1;
    try {
      blackImage_1 = await Card.build({ format: "jpeg" });
    } catch (error) {
      res.status(500).send("Error building the image card");
      return;
    }
    const blackFileName_1 = generateUniqueFileName("jpeg");
    const blackFilePath_1 = path.join(
      __dirname,
      "../../public/assets/images",
      blackFileName_1
    );

    try {
      fs.writeFileSync(blackFilePath_1, blackImage_1);
    } catch (error) {
      return;
    }
    let coverImage;

    coverImage = await uploadAndGeneratePublicUrl(blackFilePath_1);
    if (!coverImage) {
      return res.status(400).send("Cover Image not created");
    }
    console.log("Uploaded Image URL:", coverImage);
    console.log("candle:", candle);
    console.log("mug:", mug);
    console.log("tshirt:", tshirt);
    console.log("hoodie:", hoodie);

    const images_url = [
      coverImage,
      candle.images_url,
      mug.images_url,
      tshirt.images_url,
      hoodie.images_url,
      "https://drive.usercontent.google.com/download?id=1n1KTEDWMTiQhVs9rKJ-NF7QYcMg4u01J&export=view&authuser=0",
    ];
    console.log("8");
    console.log(images_url);
    const db = await postsSchema.updateOne(
      { _id: objectId },
      {
        $push: { images: { $each: images_url } },
        $set: { status: "processed", to_delete: coverImage },
      }
    );

    console.log(db);
    if (db.modifiedCount === 0) {
      res.status(400).send("Images not saved to database");
      return;
    }
    res.status(200).send("Success");
    return;
  } catch (error) {
    res.status(500).send("Error creating and uploading image or product");
    return;
  }
};

module.exports = { createAndUploadImage };
