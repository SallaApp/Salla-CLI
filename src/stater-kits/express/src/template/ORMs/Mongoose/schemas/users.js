let mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: String,
  email: String,
  email_verified_at: Number,
  verified_at: Number,
  password: String,
  remember_token: String,
});
module.exports = mongoose.model("User", usersSchema);
