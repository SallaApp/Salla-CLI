const BaseClass = require("./utils/BaseClass");
const { exec, execSync } = require("child_process");
const commandExists = require("command-exists");

const Logger = require("../utils/LoggingManager");
const watch = require("node-watch");
const path = require("path");
/**
 * @property {WatchOptions} options
 */
class Watch extends BaseClass {
  /**
   * @return {Promise<null>}
   */
  async run() {
    if (this.options.port) {
      process.env.ASSETS_PORT = this.options.port;
    }
    if (!this.options.skipStart) {
      this.runTheme("start");
      return null;
    }
    /**
     * @type {SallaConfig}
     */
    let tokens = await this.getTokens();

    this.runTheme(
      `push --token ${tokens.github.access_token} --name ${tokens.github.login}`
    );

    let packageManager = undefined;
    if (await this.isCommandExists("yarn")) {
      packageManager = "yarn";
    } else if (await this.isCommandExists("npm")) {
      packageManager = "npm";
    }

    if (
      !(await this.fileSys().pathExists(
        this.path().join(BASE_PATH, "node_modules")
      ))
    ) {
      let installLoader = Logger.loading(
        `✅ Running '${packageManager} install' ...`
      );
      // Logger.error('Folder (node_modules) is not exists! It looks that you didn\'t run (' + (packageManager + ' install').bold + ') yet.')
      this.runSysCommand(packageManager + " install");
      // return null;
      installLoader.stop();
      Logger.longLine();
    }

    let packageJs = this.packageData();
    if (!packageJs) {
      return null;
    }

    /**
     * @type {boolean|{preview_url:string, id:number}}
     */
    let response = await this.createDraftTheme();
    if (!response || !response.preview_url || !response.id) {
      Logger.error(
        "🛑 Oops! Something went wrong while creating the testing draft theme. Please try again later."
      );

      return null;
    }
    let draft_id = response.id;

    await this.configManager().set("draft_id", draft_id);
    Logger.longLine();
    Logger.success("🔬 Hooray! Your theme is ready to test!");

    let assetsPort =
      this.options.port || process.env.ASSETS_PORT || ASSETS_PORT;
    let serve = exec(`salla theme serve --port=${assetsPort} --nohead`, {
      cwd: BASE_PATH,
    });
    serve.stdout.on("data", (data) => {
      console.log("\n" + (data = data.replace("\n", "")));
      if (data.toLowerCase().includes("Error")) {
        return (this.isNotReadyGoOut = true);
      }
      if (data.includes("running")) {
        this.readyToReturn = true;
      }
    });
    if (!(await this.checkIsReadyToReturn())) {
      return null;
    }
    response.preview_url += "&assets_url=http://localhost:" + assetsPort;
    Logger.success("✅ Here goes the Preview Url: " + response.preview_url);
    Logger.longLine();
    // check if watch defined in package.json
    if (!packageJs.scripts.hasOwnProperty("watch")) {
      Logger.warn(
        "🤔 Hmmm! The system couldn't detect any watch script in the package.json file."
      );
      return null;
    }

    if (!packageManager) {
      Logger.error(
        "🛑 Oops! We found that there is no package manager installed on your system. Please install" +
          "yarn/npm".bold +
          " in your system!"
      );

      return null;
    }
    // give sometime to the server to start
    setTimeout(async () => {
      await this.openBrowser(response.preview_url);
    }, 1000);

    packageManager += packageManager === "npm" ? " run" : "";
    Logger.info(
      `✅ Currently running '${packageManager} watch'... Press Ctrl+C to quit the process.`
    );
    Logger.longLine();
    let watchProcess = exec(packageManager + " watch", {
      cwd: BASE_PATH,
    });
    watchProcess.stdout.pipe(process.stdout);
  }

  async isCommandExists(command) {
    try {
      return await commandExists(command);
    } catch (error) {
      return false;
    }
  }

  packageData() {
    try {
      return require(process.cwd() + "/package.json");
    } catch (e) {
      // There was no package.json
      Logger.error(
        "🤔 Hmmm! There is no package.json file in your project. Please create one."
      );
      return null;
    }
  }

  async createDraftTheme() {
    let createDraftLoader = Logger.loading(
      "✨ Preparing your testing theme ..."
    );

    const { repo_url, theme_name, theme_id, features } = this.configs();

    return (await this.ThemeAPI())
      .new_draft({
        repo_url: repo_url,
        name: theme_name,
        theme_id: theme_id,
        features: features,
      })
      .then((response) => {
        Logger.longLine();
        createDraftLoader.stop();
        return response.data;
      })
      .catch((err) => {
        createDraftLoader.stop();
        return null;
      });
  }
}

module.exports = Watch;
