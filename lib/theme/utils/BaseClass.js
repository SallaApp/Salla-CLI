/**
 * @typedef {{prompts?: {}, Separator?: Separator|{}, ui?: {BottomBar: BottomBar, Prompt: PromptUI}, createPromptModule?: function(*=): function(*=): *, prompt?: *, registerPrompt?: function(*=, *=): void, restoreDefaultPrompts?: function(): void}} Inquirer
 */
require("colors");
const SallaApi = require("../../api/SallaApi");
const { execSync } = require("child_process");

/**
 * @property {SallaConfig} tokens
 * @property {SallaApi} _sallaApi
 * @property {Inquirer|undefined} _inquirer
 * @property {Inquirer|undefined} _configs
 */
class BaseClass {
  constructor() {
    //TODO:: convert it to function configs() same as getTokens()
    this.readyToReturn = false;
  }

  /******* Common Helper Classes & Objects *******/
  fileSys() {
    if (this._fse) {
      return this._fse;
    }
    return (this._fse = require("fs-extra"));
  }

  /**
   * @return {Inquirer}
   */
  inquirer() {
    if (this._inquirer) {
      return this._inquirer;
    }
    return (this._inquirer = require("inquirer"));
  }

  /**
   * You can pass message directly like : logger('message')
   * Or get logger then call it like    : logger()->error('message')
   * @return {Console|console}
   */
  log() {
    if (this._logger) {
      return arguments.length ? this._logger.log(...arguments) : this._logger;
    }
    this._logger = console;
    return this.log(...arguments);
  }

  fireLog(...messages) {
    if (messages.length != 1) {
      return this._logger.log(...messages);
    }
    // if (!process.env.firedMessages) {
    process.env.firedMessages = [];
    //}
    //console.log("process.env.firedMessages", process.env.firedMessages)

    if (process.env.firedMessages.includes(messages[0])) {
      return;
    }
    //process.env.firedMessages.push(messages[0]);
    return this._logger.log(...messages);
  }

  path() {
    if (this._path) {
      return this._path;
    }
    return (this._path = require("path"));
  }

  /**
   * @param {boolean} skip_tokens_check
   * @return {Promise<SallaApi>}
   */
  async sallaApi(skip_tokens_check = false) {
    if (this._sallaApi) {
      return this._sallaApi;
    }
    this._sallaApi = new SallaApi();
    this._sallaApi.accessToken = (
      await this.getTokens(skip_tokens_check)
    ).salla.access_token;
    return this._sallaApi;
  }

  /**
   *
   * @param skip_tokens_check - in case we already checked the tokens, don't check them again
   * @return {Promise<SallaConfig>}
   */
  async getTokens(skip_tokens_check = false) {
    if (this.tokens) {
      return this.tokens;
    }
    return (this.tokens = await this.authManager(skip_tokens_check).tokens());
  }

  authManager(skip_tokens_check) {
    if (this._auth) {
      this._auth.skip_tokens_check = skip_tokens_check;
      return this._auth;
    }
    this._auth = new (require("./AuthManager"))();
    return this.authManager(skip_tokens_check);
  }

  /**
   * @return {ConfigManager}
   */
  configManager() {
    if (this._configManager) {
      return this._configManager;
    }
    return (this._configManager = new (require("./ConfigManager"))());
  }

  /**
   * @return {ThemeConfigs}
   */
  configs() {
    return this.configManager().all();
  }

  /******* End Helpers Classes & Objects *******/

  //for testing proposes
  authHeader() {
    return {
      authorization: "token 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",
    };
  }

  /******* Common Helper Methods *******/
  runTheme(command) {
    return this.runSysCommand("salla theme " + command);
  }

  runSysCommand(command) {
    return execSync(command, { stdio: "inherit", cwd: BASE_PATH });
  }

  openBrowser(url) {
    return require("open")(url);
  }

  /**
   * make a loop of checking until finding try
   * @return {Promise<unknown>}
   */
  checkIsReadyToReturn() {
    let that = this;
    return new Promise((resolve) =>
      setInterval(function () {
        if (that.readyToReturn) {
          resolve();
          clearInterval(this);
        }
        //TODO:: set timeout
      }, 100)
    );
  }

  //Logging
  success(message, ...additionalData) {
    this.log(`✓ ${message}`.green, ...additionalData);
  }

  error(message, ...additionalData) {
    this.log(`X ${message}`.red, ...additionalData);
  }

  warn(message, ...additionalData) {
    this.log().warn(`! ${message}`.yellow, ...additionalData);
  }

  //todo: one place for log debug, when developing we can add -v for more debugging
  debug() {
    this.log(...arguments);
  }

  /**
   * @param {string} file
   * @returns {Promise<Object>} - parsed JSON content of the file
   */
  async parseJsonFile(file) {
    // We use jsonLint.parse instead of JSON.parse because jsonLint throws errors with better explanations what is wrong
    try {
      return require(file);
    } catch (e) {
      throw new Error(`${file} - ${e.message}`);
    }
  }

  /******* End Common Helper Methods *******/
}

module.exports = BaseClass;
