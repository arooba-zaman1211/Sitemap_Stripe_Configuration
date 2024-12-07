const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postsSchema = new Schema({
  design_id: {
    type: String,
    required: true,
  },
  text_1: {
    type: String,
    required: true,
  },
  text_2: {
    type: String,
    default: null,
  },
  product_title: {
    type: String,
    required: true,
  },
  product_description: {
    type: [String],
    required: true,
    default: [],
  },
  date_time: {
    type: Date,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "processed", "posted", "posting"],
    default: "pending",
  },
  images: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  to_delete: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

postsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("posts", postsSchema);
