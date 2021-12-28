const BaseClass = require("./utils/BaseClass");
const { Octokit } = require("@octokit/rest");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");
const Logger = require("../../utils/LoggingManager");
const ExecutionManager = require("../../utils/ExecutionManager");
const InputsManager = require("../../utils/InputsManager");
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
      .then(async () => await this.configManager().saveUnder(themeConfig))
      .then(() => {
        Logger.success(
          `Theme ${themeConfig.theme_name} has been created successfully.`
        );
      });

    return this.runTheme("watch --skip-start");
  }

  async createSubFolderIfNeeded(theme_name) {
    if (!this.isInSubFolder(theme_name)) {
      return;
    }

    global.BASE_PATH = this.path().join(BASE_PATH, theme_name);

    //Logger.info(`  Creating new folder (${theme_name.bold})...`);
    if (await this.fileSys().exists(BASE_PATH)) {
      let message = `🛑 Oops! The folder (${theme_name.bold}) does already exist.`;
      Logger.error(
        `🛑 Oops! The folder, (${theme_name.bold}), does already exist in this directory! Please try another name.`
      );
      throw message;
    }
    await this.fileSys().mkdirs(BASE_PATH);
    Logger.longLine();
    Logger.success(
      `The folder (${theme_name.bold}) has been created successfully.`
    );
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
    let downloadinLoader = Logger.loading("✨ Downloading Base Theme ...");
    Logger.longLine();
    const latestRelease = await this.getTheLatestRelease();
    if (
      latestRelease.status === 404 ||
      !latestRelease.data ||
      !latestRelease.data[0]
    ) {
      downloadinLoader.stop();
      Logger.error(
        "🛑 Oops! The system failed to get latest Release. Please try again, ",
        latestRelease
      );
      throw "";
    }

    await this.getAndUnZip(
      latestRelease.data[0].zipball_url,
      theme_name,
      downloadinLoader
    );
  }

  async getTheLatestRelease() {
    const octokit = new Octokit();
    return await octokit.request("GET /repos/{org}/{repo}/tags", {
      headers: this.authHeader(),
      org: BASE_THEME.org,
      repo: BASE_THEME.repo,
    });
  }

  async getAndUnZip(url, theme_name, downloadinLoader) {
    //TODO:: add progress bar
    const response = await fetch(url, {
      headers: this.authHeader(),
    });
    if (!response.ok) {
      Logger.error(
        "🤔 Hmmm! Something went wrong while trying to get your base theme. Please try again."
      );
      Logger.error(await response.json());
      throw "🤔 Hmmm! Something went wrong while trying to get your base theme. Please try again.);";
    }
    downloadinLoader.stop();
    Logger.success("Base theme downloaded successfully.");
    Logger.longLine();
    let ExtractingLoader = Logger.loading("✨ Extracting base theme files ...");
    const zip = new AdmZip(await response.buffer());
    //const entries = zip.getEntries();
    const mainEntry = zip.getEntries()[0].entryName;
    zip.extractAllTo(/*target path*/ BASE_PATH, /*overwrite*/ false);
    const srcDir = this.path().join(BASE_PATH, mainEntry);
    this.fileSys().copySync(
      srcDir,
      BASE_PATH,
      {
        overwrite: false,
      },
      (err) => (err ? Logger.error(err) : Logger.success("🎉 Hooray!"))
    );
    this.fileSys().removeSync(srcDir);
    this.fileSys().removeSync(this.path().join(BASE_PATH, ".github"));
    //Logger.success('Base theme is ready.');
    ExtractingLoader.stop();
    return true;
  }

  readThemeConfig() {
    try {
      return this.configs();
    } catch (err) {
      Logger.info(`Building New ${"Salla".bold} Theme   `);

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
        message: "What would you like to name your theme?",
        validate: (val) =>
          /^[a-zA-Z0-9\s_-]+$/.test(val) ||
          "🛑 Oops! An error occured. Please enter a valid theme name",
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
    let ans = {};
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type == "input") {
        ans[questions[i].name] = InputsManager.readLine(questions[i].message, {
          validate: questions[i].validate,
          name: questions[i].name,
          errorMessage: questions[i].errorMessage,
          desc: questions[i].desc,
        });
      } else {
        ans[questions[i].name] = await InputsManager.selectInput(
          questions[i].message,
          questions[i].options,
          questions[i].desc
        );
      }
    }
    return ans;
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
