const mongoose = require("mongoose");

const AccessTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expirationDate: { type: Date, required: true },
});

module.exports = mongoose.model("tokens", AccessTokenSchema);
