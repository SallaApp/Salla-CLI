const SallaApi = new (require("../../api/SallaApi"))();

const Logger = require("../LoggingManager");
const fs = require("fs-extra");

/**
 * @typedef {{
 *            salla     : {access_token: string, store_id: number, store_url: string},
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

  async getTokens() {
    if (this.configData) {
      return this.configData;
    }
    try {
      this.configData = fs.existsSync(CLI_CONFIG_FILE)
        ? require(CLI_CONFIG_FILE)
        : null;
    } catch (error) {
      Logger.error("Error while reading config file: ", error.message);
      return null;
    }
    this.configData;
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
      Logger.error("Error while saving config file: ", err.message);
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
  async isGithubTokenValid(GithubAPI) {
    try {
      /**
       * @see https://docs.github.com/en/rest/reference/users#get-the-authenticated-user--code-samples
       * @type {{login:string, id:number, email:string, name:string, ...}}
       */
      let user = GithubAPI.getUser();
      if (this.configData.github.login !== user.login) {
        this.configData.github.login = user.login;
        await this.save(this.configData);
      }

      return true;
    } catch (err) {
      return false;
    }
  }
  async isSallaTokenValid() {
    if (!this.configData.salla || !this.configData.salla.access_token) {
      return false;
    }
    SallaApi.setAccessToken(this.configData.salla.access_token);

    let user = await SallaApi.request("user");
    if (user && user.success) {
      return true;
    }

    return false;
  }

  /**
   * @param {string} key
   * @param {JsonValue|JsonValue[]} value
   */
  async set(key, value) {
    const config = await this.getTokens();
    if (config == null) config = {};
    config[key] = value;
    await this.save(config);
  }
}

module.exports = AuthManager;
