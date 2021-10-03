require("colors");
const { join } = require("path");

const cliProgress = require("cli-progress");
const simpleGit = require("simple-git");
const git = simpleGit();

const {
  SATARTER_THEME_URL,
  THEME_PATH
} = require("../../constants");

const inquirerModule = require("inquirer");
const ConfigManager = require("./ConfigManager");

class SallaThemeStart {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfigManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
    this._logger = logger;
  }

  async run(cliOptions = {}) {
    const currentThemeConfig = await this.readThemeConfig();
    const defaultAnswers = this.getDefaultAnswers(currentThemeConfig);
    const questions = this.getQuestions(defaultAnswers, cliOptions);
    const answers = await this.askQuestions(questions);
    const themeConfig = this.applyAnswers(
        currentThemeConfig,
      answers,
      cliOptions
    );
    await this.cloneTheRebo(answers.themeName);
    await this._ConfigManager.save(themeConfig);

    this._logger.log(
      "You are now ready to go! To start developing,\n" +
      "cd ".cyan + answers.themeName + "\n" +
      "salla theme watch".cyan
    );
  }

  async cloneTheRebo(themeName) {
    console.log("\n");
    const target = join(THEME_PATH, themeName);
    const bar1 = new cliProgress.SingleBar({},
      cliProgress.Presets.shades_classic
    );
    bar1.start(100, 0);
    bar1.increment();
    bar1.update(20);
    await git
      .clone(SATARTER_THEME_URL,target ,{'--depth' : 1, '--single-branch': true, '--no-tags': true}).cwd({ path: target,root: true,  })
      .then(() => bar1.update(100));
     // await git.clone(SATARTER_THEME_URL, target);
      //await git.cwd({ path: target, root: true });

    bar1.stop();
    console.log("\n");
  }

  async readThemeConfig() {
    let parsedConfig;
    try {
      parsedConfig = await this._ConfigManager.read(false, false);
    } catch (err) {
      this._logger.error(
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
      version: "1.0.0",
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