require("colors");
const fsModule = require("fs");
const path = require("path");

const fsUtilsModule = require("./utils/fsUtils");
const { THEME_PATH } = require("../../constants");

class SallaConfigManager {
  constructor({
    themePath = THEME_PATH,
    fs = fsModule,
    fsUtils = fsUtilsModule,
    logger = console,
  } = {}) {
    this.configFileName = "theme.json";
    this.secretsFileName = "secrets.salla.json";

    this.themePath = themePath;
    this.configPath = path.join(themePath, this.configFileName);
    this.secretsPath = path.join(themePath, this.secretsFileName);
    this.secretFieldsSet = new Set(["accessToken", "githubToken"]);

    this._fs = fs;
    this._fsUtils = fsUtils;
    this._logger = logger;
  }

  /**
   * @param {boolean} ignoreFileNotExists
   * @param {boolean} ignoreMissingFields
   * @returns {object|null}
   */
  async read(ignoreFileNotExists = false, ignoreMissingFields = false) {
    const generalConfig = this._fs.existsSync(this.configPath)
      ? await this._fsUtils.parseJsonFile(this.configPath)
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
   * @param {boolean} ignoreFileNotExists
   * @param {boolean} ignoreMissingFields
   * @returns {object|null}
   */
  async readAuth(ignoreFileNotExists = false, ignoreMissingFields = false) {
    const secretsConfig = this._fs.existsSync(this.secretsPath)
      ? await this._fsUtils.parseJsonFile(this.secretsPath)
      : null;
    if (secretsConfig) {
      return this._validateSallaConfig(secretsConfig, ignoreMissingFields);
    }

    if (ignoreFileNotExists) {
      return null;
    }

    throw new Error(
      "Please run".red + " $ salla theme start".cyan + " first.".red
    );
  }

  /**
   * @param {object} config
   */
  async save(config) {
    await this._fs.promises.writeFile(
      this.configPath,
      JSON.stringify(config, null, 2)
    );
  }

  /**
   * @private
   * @param {object} config
   * @param {boolean} ignoreMissingFields
   * @returns {object}
   */
  _validateSallaConfig(config, ignoreMissingFields) {
    if (!ignoreMissingFields && !config.version) {
      throw new Error(
        "Error: Your theme config is outdated. Please run".red +
          " $ salla theme start".cyan +
          " again.".red
      );
    }
    return config;
  }
}

module.exports = SallaConfigManager;
