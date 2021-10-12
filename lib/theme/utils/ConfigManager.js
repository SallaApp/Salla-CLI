require("colors");
const fsModule = require("fs");
const path = require("path");
const fsUtilsModule = require("./fsUtils");
const {
  THEME_PATH
} = require("../../../constants");

class ConfigManager {
  constructor({
    themePath = THEME_PATH,
    fs = fsModule,
    fsUtils = fsUtilsModule,
    logger = console,
  } = {}) {
    this.configFileName = "theme.json";
    this.themePath = themePath;
    this.configPath = path.join(themePath, this.configFileName);
    this._fs = fs;
    this._fsUtils = fsUtils;
    this._logger = logger;
  }


  isExists() {
    return this._fs.existsSync(this.configPath);
  }


  async read() {
    const generalConfig = this._fs.existsSync(this.configPath) ?
      await this._fsUtils.parseJsonFile(this.configPath) :
      null;

    if (generalConfig) {
      return this._validateSallaConfig(generalConfig);
    }

    throw new Error(
      "Please run".red + " $ salla theme start".cyan + " first.".red
    );
  }



  /**
   * @param {object} config
   */
  async save(config , themeName) {
    const themePath = path.join(this.themePath, themeName);
    const target =  path.join(themePath, this.configFileName);
    console.log("Target after frist time",target)
    await this._fs.promises.writeFile(
      target,
      JSON.stringify(config, null, 2)
    );
  }

  /**
   * @private
   * @param {object} config
   * @returns {object}
   */
  _validateSallaConfig(config) {
    if (!config.version) {
      throw new Error(
        "Error: Your theme config is outdated. Please run".red +
        " $ salla theme start".cyan +
        " again.".red
      );
    }
    return config;
  }

  async addItem(item, value) { 
    // add or update
    const config = await this.read();
    const obj = JSON.parse(JSON.stringify(config));
    obj[item] = value;
    this.save(obj, obj.themeName);
  }

}
module.exports = ConfigManager;