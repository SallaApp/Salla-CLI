const fs = require("fs");
const homedir = require("../../helpers/home.dir");
module.exports = class AuthManager {
  // we save everything as json object

  _TOKENS_FILE_NAME = ".salla.secrets";
  _TOKENS_FILE_PATH = "";
  constructor() {
    this._TOKENS_FILE_PATH = homedir() + "/" + this._TOKENS_FILE_NAME;
    if (!fs.existsSync(this._TOKENS_FILE_PATH)) {
      fs.writeFileSync(this._TOKENS_FILE_PATH, "{}");
    }
  }

  // save key
  saveToken = (key, value) => {
    let tokens = this.getTokens();
    fs.writeFileSync(
      this._TOKENS_FILE_PATH,
      JSON.stringify({ ...tokens, [key]: value })
    );
  };
  // get key
  getTokens = (key = null) => {
    let tokens = fs.readFileSync(this._TOKENS_FILE_PATH);
    tokens = JSON.parse(tokens);
    if (key) {
      return tokens[key];
    } else {
      return tokens;
    }
  };
  // delete key
  delete = (key) => {
    let tokens = this.getTokens();
    delete tokens[key];
    fs.writeFileSync(this._TOKENS_FILE_PATH, JSON.stringify({ ...tokens }));
  };
};
