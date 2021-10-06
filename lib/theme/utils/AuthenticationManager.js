require("colors");
const fsModule = require("fs");
const path = require("path");
const homedir = require("os").homedir();
const dir = homedir + "/.salla";
const authenticationPath = path.join(dir, "config.json");
const fsUtilsModule = require("./fsUtils");

class AuthenticationManager {
  constructor({
    fs = fsModule,
    fsUtils = fsUtilsModule,
    authPath = authenticationPath,
    folderName = dir,
    logger = console,
  } = {}) {
    this._authPath = authPath;
    this._fs = fs;
    this._fsUtils = fsUtils;
    this._logger = logger;
    this._folderName = folderName;
  }

  isExists() {
    return this._fs.existsSync(this._authPath);
  }

  async read() {
    const authConfig = this._fs.existsSync(this._authPath) ?
      await this._fsUtils.parseJsonFile(this._authPath) :
      null;

    if (authConfig) {
      return this._validateFile(authConfig);
    }

    throw new Error(
      "Please run".red + " $ salla theme start".cyan + " first.".red
    );
  }

  /**
   * @param {object} token
   */
  async save(token) {
    if (!this._fs.existsSync(this._folderName)) {
      this._fs.mkdirSync(this._folderName, {
        recursive: true,
      });
    }
    this._fs.writeFile(this._authPath, token, (err) => {
      if (err) return console.error(err);
      console.log("Token stored to", this._authPath);
    });
  }

  /**
   * @param {object} authConfig
   */
  _validateFile(authConfig) {
    if (!authConfig.salla && !authConfig.github) {
      throw new Error(
        "Error: Your auth config is outdated. Please run".red +
        " $ salla theme start".cyan +
        " again.".red
      );
    }
    return authConfig;
  }
}
module.exports = AuthenticationManager;