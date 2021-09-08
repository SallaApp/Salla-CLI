require("colors");
const path = require("path");
const cliProgress = require("cli-progress");
const simpleGit = require("simple-git");
const git = simpleGit();
const { SATARTER_THEME_URL, THEME_PATH } = require("../../constants");

const inquirerModule = require("inquirer");
const SallaConfigManager = require("./SallaConfigManager");

class SallaThemeStart {
  /**
   * @param inquirer
   * @param SallaConfigManager
   * @param serverConfig
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    sallaConfigManager = new SallaConfigManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._sallaConfigManager = sallaConfigManager;
    this._logger = logger;
  }

  async run(cliOptions = {}) {
    const oldSallaConfig = await this.readSallaConfig();
    const defaultAnswers = this.getDefaultAnswers(oldSallaConfig);
    const questions = this.getQuestions(defaultAnswers, cliOptions);
    const answers = await this.askQuestions(questions);
    const updatedSallaConfig = this.applyAnswers(
      oldSallaConfig,
      answers,
      cliOptions
    );
    await this._sallaConfigManager.save(updatedSallaConfig);

    await this.cloneTheRebo(answers.themeName);

    this._logger.log(
      "You are now ready to go! To start developing, run $ " +
        "salla theme watch".cyan
    );
  }

  async cloneTheRebo(themeName) {
    console.log("\n");
    const bar1 = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    bar1.start(100, 0);
    bar1.increment();
    bar1.update(20);
    await git
      .clone(SATARTER_THEME_URL, path.join(THEME_PATH, themeName))
      .then(() => bar1.update(100));
    bar1.stop();
    console.log("\n");
  }

  async readSallaConfig() {
    let parsedConfig;
    try {
      parsedConfig = await this._sallaConfigManager.read(false, false);
    } catch (err) {
      this._logger.error(
        "Detected a broken theme.json:\n",
        "The file will be rewritten with your answers"
      );
    }

    return parsedConfig || {};
  }

  getDefaultAnswers(sallaConfig) {
    return {
      themeName: sallaConfig.themeName,
      author: sallaConfig.author,
      email: sallaConfig.email,
      supportUrl: sallaConfig.supportUrl,
    };
  }

  getQuestions(defaultAnswers, cliOptions) {
    const prompts = [];

    if (!cliOptions.themeName) {
      prompts.push({
        type: "input",
        name: "themeName",
        message: "What you want to call your theme ?",
        validate: (val) =>
          /^[a-zA-Z]+$/.test(val) || "You must enter a Valid name",
        default: defaultAnswers.themeName,
      });
    }

    if (!cliOptions.author) {
      prompts.push({
        type: "input",
        name: "author",
        message: "What is the author name ?",
        validate: (val) =>
          /^[a-zA-Z]+$/.test(val) || "You must enter a Valid name",
        default: defaultAnswers.author,
      });
    }

    if (!cliOptions.email) {
      prompts.push({
        type: "input",
        name: "email",
        message: "What is your email ?",
        validate: (val) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "You must enter an email",
        default: defaultAnswers.email,
      });
    }

    if (!cliOptions.supportUrl) {
      prompts.push({
        type: "input",
        name: "supportUrl",
        message: "What is your support url ?",
        validate: (val) => /^https?:\/\//.test(val) || "You must enter a URL",
        default: defaultAnswers.supportUrl,
      });
    }

    return prompts;
  }

  /**
   * @param {{object[]}} questions
   * @returns {Promise<object>}
   */
  async askQuestions(questions) {
    return questions.length ? this._inquirer.prompt(questions) : {};
  }

  /**
   * @param {object} sallaConfig
   * @param {object} answers
   * @param {object} cliOptions
   * @returns {object}
   */
  applyAnswers(sallaConfig, answers, cliOptions) {
    const defaultValue = {
      version: 1,
      defaults: {
        "primary-color": "#dddddd",
        "secondary-color": "#cccccc",
      },
    };
    const newConfig = {
      ...defaultValue,
      ...sallaConfig,
    };

    return {
      ...newConfig,
      ...cliOptions,
      ...answers,
    };
  }
}

module.exports = SallaThemeStart;
