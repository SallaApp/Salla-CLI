const Logger = require("../LoggingManager");
const fs = require("fs-extra");

const GithubAPI = new (require("./Github"))();
const SallaAuthAPI = new (require("./SallaAuthApi"))();

/**
 * @typedef {{
 *            salla     : {theme_access_token:string,access_token: string, store_id: number, store_url: string},
 *            github    : {access_token: string, login: string|undefined},
 *            BASE_URL  : string|undefined
 *          }} SallaConfig
 */

/**
 *
 * @property {undefined|SallaConfig} configData
 */
class AuthManager {
  /**
   * @return {Promise<SallaConfig>}
   */
  constructor() {
    try {
      this.configData = fs.existsSync(CLI_CONFIG_FILE)
        ? require(CLI_CONFIG_FILE)
        : null;
      GithubAPI.setGithubConfigData(this.configData.github || {});
    } catch (error) {
      Logger.error(
        "🤔 Hmmm! Something went wrong while writing config file: ",
        error.message
      );
    }
  }
  async getTokens() {
    if (this.configData) {
      return this.configData;
    }
    try {
      this.configData = fs.existsSync(CLI_CONFIG_FILE)
        ? require(CLI_CONFIG_FILE)
        : null;
    } catch (error) {
      Logger.error(
        "🤔 Hmmm! Something went wrong while writing config file: ",
        error.message
      );
      return null;
    }
    console.log("this.configData", this.configData);
    return this.configData;
  }
  async askForGithubToken() {
    let github_token = await GithubAPI.askForGithubToken();
    if (!this.configData.github) this.configData.github = {};
    this.configData.github.access_token = github_token;
    await this.set("github", {
      access_token: github_token,
    });
  }
  saveUserInfo(userInfo) {
    this.set("salla", {
      ...this.configData.salla,
      userInfo: {
        id: userInfo.id,
        email: userInfo.email,
      },
    });
  }
  getUserInfo() {
    try {
      return this.configData.salla.userInfo;
    } catch (err) {
      return null;
    }
  }
  /**
   * @param {object|SallaConfig} token
   * @param withLog
   */
  async save(configData) {
    if (!(await fs.existsSync(CLI_CONFIG_DIR))) {
      await fs.mkdirSync(CLI_CONFIG_DIR, {
        recursive: true,
      });
    }

    //to allow separate url for each salla developer
    if (!configData.BASE_URL) {
      configData.BASE_URL = BASE_URL;
    }
    try {
      return fs.writeJSONSync(CLI_CONFIG_FILE, configData);
    } catch (err) {
      Logger.error(
        "🤔 Hmmm! Something went wrong while writing config file: ",
        err.message
      );
      return;
    }
  }

  /**
   * @param {SallaConfig|undefined} configs
   * @return {boolean}
   */
  async isConfigValid() {
    return (
      this.configData &&
      (await this.isSallaTokenValid()) &&
      (await this.isGithubTokenValid())
    );
  }
  async isGithubTokenValid() {
    return GithubAPI.isTokenValid(this.configData.github);
  }

  async isSallaTokenValid() {
    return SallaAuthAPI.isSallaTokenValid(this.configData.salla);
  }

  /**
   * @param {string} key
   * @param {JsonValue|JsonValue[]} value
   */
  async set(key, value) {
    const config = await this.getTokens();
    if (config == null) config = {};
    if (typeof value === "object")
      config[key] = {
        ...config[key],
        ...value,
      };
    else config[key] = value;
    await this.save(config);
  }
}

module.exports = () => {
  let AuthObj = new AuthManager();
  GithubAPI.setAuthManager(AuthObj);
  SallaAuthAPI.setAuthManager(AuthObj);
  return {
    GithubAPI,
    AuthManager: AuthObj,
    SallaAuthAPI,
  };
};
