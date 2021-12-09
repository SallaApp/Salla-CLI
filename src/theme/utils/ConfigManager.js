/**
 * @typedef {{
 *              repo_url: string,
 *              theme_name: string,
 *              defaults: {"primary-color": string, "secondary-color": string},
 *              author: string,
 *              support_url: string,
 *              theme_id: string,
 *              draft_id: number,
 *              version: string,
 *              email: string}} ThemeConfigs
 */
/**
 * @typedef {string|boolean|number} BaseJsonValue
 */
/**
 * @typedef {BaseJsonValue|BaseJsonValue[]|Object<string,BaseJsonValue>} JsonValue
 */
const BaseClass = require("./BaseClass");

/**
 * @property {ThemeConfigs|undefined} _configs
 */
class ConfigManager extends BaseClass {
  isExists() {
    return this.fileSys().exists(this.configPath());
  }

  configPath() {
    return this.path().join(BASE_PATH, "theme.json");
  }

  /**
   *
   * @return {ThemeConfigs}
   */
  all() {
    if (this._configs) {
      return this._configs;
    }
    try {
      this._configs = require(this.configPath());
      if (this.isConfigValid(this._configs)) {
        return this._configs;
      }
      this._configs = undefined;
    } catch (e) {}
    throw (
      "🛑 Oops! the theme.json config file is corrupted. Try: to\n" +
      "  - Remove theme.json file.\n".red +
      " run $ salla theme start".cyan +
      " again.".red
    );
  }

  /**
   * @param {object} config
   * @return {*}
   */
  save(config) {
    return this.fileSys().writeFile(
      this.configPath(),
      JSON.stringify(config, null, 4)
    );
  }
  /**
   * @param {object} config
   * @return {*}
   */
  saveUnder(config) {
    return this.fileSys().writeFile(
      this.configPath(),
      JSON.stringify({ ...this.all(), ...config }, null, 4)
    );
  }

  /**
   * @param {ThemeConfigs} config
   * @returns {boolean}
   */
  isConfigValid(config) {
    return !!config.version;
  }

  /**
   * @param {string} key
   * @return {JsonValue}
   */
  get(key) {
    return this.all()[key];
  }

  /**
   * @param {string} key
   * @param {JsonValue|JsonValue[]} value
   * @return {*}
   */
  set(key, value) {
    const config = this.all();
    config[key] = value;
    return this.save(config);
  }
}

module.exports = ConfigManager;
