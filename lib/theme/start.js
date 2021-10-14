require("colors");
const { join } = require("path");
const { Octokit } = require("@octokit/rest");
const fsModule = require("fs-extra");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");

const cliProgress = require("cli-progress");
const simpleGit = require("simple-git");

const git = simpleGit();
const { execSync } = require("child_process");

const { SATARTER_THEME_INFO, THEME_PATH } = require("../../constants");
const inquirerModule = require("inquirer");
const ConfManager = require("./utils/ConfigManager");

class ThemeStart {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfManager(),
    logger = console,
    fse = fsModule,

  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
    this._logger = logger;
    this._fse = fse
  }

  async run(cliOptions = {}) {
    if (!this._ConfigManager.isExists()) {
     
      const currentThemeConfig = await this.readThemeConfig();
      const defaultAnswers = this.getDefaultAnswers(currentThemeConfig);
      const questions = this.getQuestions(defaultAnswers, cliOptions);
      const answers = await this.askQuestions(questions);
      const themeConfig = this.applyAnswers(
        currentThemeConfig,
        answers,
        cliOptions
      );

      await this.cloneTheRebo(answers.themeName).then(() => {
        console.log("Files downloaded successfully");
        this._ConfigManager.save(themeConfig);
      });

      this._logger.log(
        "You are now ready to go! To start developing,\n" +
          "cd ".cyan +
          answers.themeName +
          "\n" +
          "npm install \n".cyan +
          "salla theme watch".cyan
      );
    } else {
      this._logger.log(
        "thems.json already exists. you can start editing your amazing theme"
          .green
      );
      //Existed: run salla theme watch --skip-start
      execSync("salla theme watch --skip-start", {
        stdio: "inherit",
      });
    }
  }

  async cloneTheRebo(themeName) {
    console.log("\n");
    const latestRelease = await this.getTheLatestRelease();
    if (latestRelease.status != 404) {
      const { tag_name } = latestRelease.data;
      const urlLatestRelease = `${SATARTER_THEME_INFO.url}/archive/refs/tags/${tag_name}.zip`;
    //console.log("urlLatestRelease", urlLatestRelease);
      await this.getAndUnZip(urlLatestRelease, themeName);
    }
    console.log("\n");
  }

  async getTheLatestRelease() {
    const octokit = new Octokit();
    return await octokit
      .request("GET /repos/{owner}/{repo}/releases/latest", {
        owner: SATARTER_THEME_INFO.owner,
        repo: SATARTER_THEME_INFO.repo,
      })
  }

  async getFiles(url) {
    return fetch(url).then((res) => res.buffer());
  }

  async getAndUnZip(url, themeName) {
    const target = join(THEME_PATH, themeName);
    const zipFileBuffer = await this.getFiles(url);
    const zip = new AdmZip(zipFileBuffer);
    //const entries = zip.getEntries();
    const mainEntry = zip.getEntries()[0].entryName;
    zip.extractAllTo(/*target path*/ target, /*overwrite*/ false);
    const srcDir = join(target, mainEntry);
    this._fse.copySync(srcDir, target, { overwrite: false }, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("success!");
      }
    });
    this._fse.removeSync(srcDir);
  }

  async readThemeConfig() {
    let parsedConfig;
    try {
      parsedConfig = await this._ConfigManager.read();
    } catch (err) {
      this._logger.error(
        "Let's start bulding a new theme \n" +
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
      themeName:"",
      repo_url:"",
      themeId: "",
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

module.exports = ThemeStart;
