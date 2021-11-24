const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const oauthtokenSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" }, // foreign key
  merchant: Number,
  access_token: String,
  expires_in: Number,
  refresh_token: String,
});
module.exports = mongoose.model("oAuthToken", oauthtokenSchema);
