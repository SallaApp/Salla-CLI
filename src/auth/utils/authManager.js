const fs = require("fs-extra");

module.exports = class AuthManager {
  // we save everything as json object

  _TOKENS_FILE_PATH = "";
  constructor() {
    this._TOKENS_FILE_PATH = global.CLI_CONFIG_FILE;
  }

  // save key
  saveToken = (key, value) => {
    let tokens = this.getTokens();

    fs.writeJSONSync(this._TOKENS_FILE_PATH, { ...tokens, [key]: value });
  };
  // get key
  getTokens = (key = null) => {
    try {
      let tokens = fs.readJSONSync(this._TOKENS_FILE_PATH);
      if (key) {
        return tokens[key];
      } else {
        return tokens;
      }
    } catch (err) {
      console.log("ERROR READING TOKENS FROM ", this._TOKENS_FILE_PATH, err);
      return {};
    }
  };
  // delete key
  delete = (key) => {
    let tokens = this.getTokens();
    delete tokens[key];
    fs.writeJSONSync(this._TOKENS_FILE_PATH, { ...tokens });
  };
};
