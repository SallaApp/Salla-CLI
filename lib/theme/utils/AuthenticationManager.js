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

  /**
   * @param {boolean} ignoreFileNotExists
   * @param {boolean} ignoreMissingFields
   * @returns {object|null}
   */
  async read(ignoreFileNotExists = false, ignoreMissingFields = false) {
    const generalConfig = this._fs.existsSync(this.authPath)
      ? await this._fsUtils.parseJsonFile(this.authPath)
      : null;

    if (generalConfig) {
      return this._validateSallaConfig(generalConfig, ignoreMissingFields);
    }

    if (ignoreFileNotExists) {
      return null;
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
}
module.exports = AuthenticationManager;
