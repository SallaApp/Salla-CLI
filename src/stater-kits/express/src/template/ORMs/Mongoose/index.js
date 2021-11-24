let mongoose = require("mongoose");

const server = process.env.DATABASE_SERVER; // REPLACE WITH YOUR DB SERVER
const database = "my_app_db"; // REPLACE WITH YOUR DB NAME
const username = process.env.DATABASE_USERNAME; // REPLACE WITH YOUR DB NAME
const password = process.env.DATABASE_PASSWORD; // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect();
  }
  userModel = require("./schemas/users");
  oauthTokenModel = require("./schemas/oauthtokens");
  _connect() {
    mongoose
      .connect(`mongodb+srv://${username}:${password}@${server}/${database}`)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error", err);
      });
  }
}

module.exports = new Database();
