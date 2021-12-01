const BaseClass = require("./utils/BaseClass");
const { Octokit } = require("@octokit/rest");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");
const Logger = require("../utils/LoggingManager");
const ExecutionManager = require("../../src/utils/ExecutionManager");
const executor = new ExecutionManager();
/**
 * @property {StartOptions} options
 */
class Start extends BaseClass {
  async run() {
    //to avoid using word 'theme_name' in command line, just using 'name'
    this.options.theme_name = this.options.name || "";
    delete this.options.name;

    // this will exit if node version is lower than what's been required
    executor.checkNodeVersion();
    if (await this.configManager().isExists()) {
      //Logger.success("Theme is exists.");
      this.runTheme("watch --skip-start");
      return;
    }

    this._isEmptyDir = this.isEmptyDirectory();
    const currentThemeConfig = await this.readThemeConfig();
    const defaultAnswers = this.getDefaultAnswers(currentThemeConfig);
    const questions = this.getQuestions(defaultAnswers);
    const answers = await this.askQuestions(questions);
    const themeConfig = this.applyAnswers(
      currentThemeConfig,
      answers,
      this.options
    );
    themeConfig.theme_name = themeConfig.theme_name.replace(/\s/g, "-"); //replace spaces to underscore

    await this.createSubFolderIfNeeded(themeConfig.theme_name);

    await this.cloneRepo(themeConfig.theme_name)
      .then(async () => await this.configManager().save(themeConfig))
      .then(() => Logger.success(`Theme config stored into theme.json`));

    return this.runTheme("watch --skip-start");
  }

  async createSubFolderIfNeeded(theme_name) {
    if (!this.isInSubFolder(theme_name)) {
      return;
    }

    global.BASE_PATH = this.path().join(BASE_PATH, theme_name);

    //Logger.info(`  Creating new folder (${theme_name.bold})...`);
    if (await this.fileSys().exists(BASE_PATH)) {
      let message = `Folder (${theme_name.bold}) is already exists.`;
      Logger.error(
        `Folder (${theme_name.bold}) is already existed in this directory!`
      );
      throw message;
    }
    await this.fileSys().mkdirs(BASE_PATH);
    Logger.success(`Folder (${theme_name.bold}) created successfully.`);
    //Logger.info(`  Changing working directory to (${theme_name.bold})...`);
    process.chdir(theme_name);
  }

  /**
   * Current theme is in subFolder, when:
   * - it's not empty dir.
   * - theme_name not same as current folder name.
   * - current folder name with spaces.
   *
   * @param {string} theme_name
   * @return {boolean}
   */
  isInSubFolder(theme_name) {
    return !(
      this._isEmptyDir && theme_name === this.path().basename(BASE_PATH)
    );
  }

  async cloneRepo(theme_name) {
    Logger.info("  Downloading Base Theme, please wait...");
    const latestRelease = await this.getTheLatestRelease();
    if (
      latestRelease.status === 404 ||
      !latestRelease.data ||
      !latestRelease.data[0]
    ) {
      Logger.error("Failed to get latest Release", latestRelease);
      throw "";
    }
    await this.getAndUnZip(latestRelease.data[0].zipball_url, theme_name);
  }

  async getTheLatestRelease() {
    const octokit = new Octokit();
    return await octokit.request("GET /repos/{org}/{repo}/tags", {
      headers: this.authHeader(),
      org: BASE_THEME.org,
      repo: BASE_THEME.repo,
    });
  }

  async getAndUnZip(url, theme_name) {
    //TODO:: add progress bar
    const response = await fetch(url, { headers: this.authHeader() });
    if (!response.ok) {
      Logger.error("Failed to get base theme.");
      Logger.error(await response.json());
      throw "Failed to get base theme );";
    }

    Logger.success("Base theme downloaded");
    Logger.info("  Extracting base theme files...");
    const zip = new AdmZip(await response.buffer());
    //const entries = zip.getEntries();
    const mainEntry = zip.getEntries()[0].entryName;
    zip.extractAllTo(/*target path*/ BASE_PATH, /*overwrite*/ false);
    const srcDir = this.path().join(BASE_PATH, mainEntry);
    this.fileSys().copySync(srcDir, BASE_PATH, { overwrite: false }, (err) =>
      err ? Logger.error(err) : Logger.success("success!")
    );
    this.fileSys().removeSync(srcDir);
    this.fileSys().removeSync(this.path().join(BASE_PATH, ".github"));
    //Logger.success('Base theme is ready.');
    return true;
  }

  readThemeConfig() {
    try {
      return this.configs();
    } catch (err) {
      Logger.info(`********** Building New ${"Salla".bold} Theme **********`);
      return {};
    }
  }

  getDefaultAnswers(sallaConfig) {
    return {
      theme_name:
        sallaConfig.theme_name ||
        this.options.theme_name ||
        this.getDefaultThemeName(),
      author: sallaConfig.author || "",
      email: sallaConfig.email || "",
      support_url: sallaConfig.support_url || "",
    };
  }

  /**
   * Get current folder name as default theme name, only if it's empty directory
   * @return {undefined|string}
   */
  getDefaultThemeName() {
    return this._isEmptyDir
      ? this.path().basename(BASE_PATH).replace(/\s/g, "-")
      : undefined;
  }

  isEmptyDirectory(path) {
    return !this.fileSys()
      .readdirSync(path || BASE_PATH)
      .filter((file) => ![".DS_Store", ".idea"].includes(file)).length;
  }

  getQuestions(defaultAnswers) {
    const prompts = [];

    if (!this.options.theme_name) {
      prompts.push({
        type: "input",
        name: "theme_name",
        message: "What you want to call your theme ?",
        validate: (val) =>
          /^[a-zA-Z0-9\s_-]+$/.test(val) || "You must enter a Valid name",
        default: defaultAnswers.theme_name,
      });
    }

    // if (!this.options.author) {
    //     prompts.push({
    //         type   : "input",
    //         name   : "author",
    //         message: "What is the author name ?",
    //         // validate: (val) => /^[a-zA-Z]+$/.test(val) || "You must enter a Valid name",
    //         default: defaultAnswers.author,
    //     });
    // }

    // if (!this.options.email) {
    //     prompts.push({
    //         type   : "input",
    //         name   : "email",
    //         message: "What is your email ?",
    //         // validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "You must enter an email",
    //         default: defaultAnswers.email,
    //     });
    // }

    // if (!this.options.support_url) {
    //     prompts.push({
    //         type   : "input",
    //         name   : "support_url",
    //         message: "What is your support url ?",
    //         // validate: (val) => /^https?:\/\//.test(val) || "You must enter a URL",
    //         default: defaultAnswers.support_url,
    //     });
    // }

    return prompts;
  }

  /**
   * @param {{object[]}} questions
   * @returns {Promise<object>}
   */
  async askQuestions(questions) {
    return questions.length ? this.inquirer().prompt(questions) : {};
  }

  /**
   * @param {object} sallaConfig
   * @param {object} answers
   * @returns {object}
   */
  applyAnswers(sallaConfig, answers) {
    const defaultValue = {
      version: "1.0.0",
      theme_name: "",
      repo_url: "",
      theme_id: "",
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
      ...this.options,
      ...answers,
    };
  }
}

module.exports = Start;
