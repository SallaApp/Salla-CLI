const BaseClass = require("./utils/BaseClass");
const { exec, execSync } = require("child_process");
const commandExists = require("command-exists");
const stream = require("stream");
const Logger = require("../utils/LoggingManager");
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
      Logger.info(`  running '${packageManager} install'...`);
      // Logger.error('Folder (node_modules) is not exists! It looks that you didn\'t run (' + (packageManager + ' install').bold + ') yet.')
      this.runSysCommand(packageManager + " install");
      // return null;
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
        "🛑 Oops! Something went wrong while creating the testing theme. Please try again later."
      );

      return null;
    }

    await this.configManager().set("draft_id", response.id);
    Logger.success("🎉Hooray! Your theme is ready to test!");

    let assetsPort =
      this.options.port || process.env.ASSETS_PORT || ASSETS_PORT;
    let serve = exec(`salla theme serve --port=${assetsPort}`, {
      cwd: BASE_PATH,
    });
    serve.stdout.on("data", (data) => {
      Logger.info((data = data.replace("\n", "")));
      if (data.toLowerCase().includes("Error")) {
        return (this.isNotReadyGoOut = true);
      }
      if (data.includes("Local server is running")) {
        this.readyToReturn = true;
      }
    });
    if (!(await this.checkIsReadyToReturn())) {
      return null;
    }
    response.preview_url += "&assets_url=http://localhost:" + assetsPort;
    Logger.success("✅ Here goes the Preview Url:", response.preview_url);

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

    await this.openBrowser(response.preview_url);

    packageManager += packageManager === "npm" ? " run" : "";
    Logger.info(
      `✅ Currently running '${packageManager} watch'... Press Ctrl+C to quit the process.`
    );
    this.runSysCommand(packageManager + " watch");
    //
    // var spawn = require('child_process').spawn;
    // var browserOpened = false;
    // var watch = spawn(packageManager, ['watch'], { stdio: [process.stdin, process.stdout, 'pipe'] });
    // var customStream = new stream.Writable();
    // customStream._write = function (data, ...argv) {
    //     console.log('your notation');
    //     process.stderr._write(data, ...argv);
    //     if (data.includes('compiled successfully in') && !browserOpened) {
    //         browserOpened = true;
    //         this.openBrowser(response.preview_url);
    //     }
    // };
    // watch.stderr.pipe(customStream);

    //let npmWatch = exec(packageManager + ' watch'); //don't run it sync to avoid server stop serving
    //npmWatch.stdout.on('data', data => console.log(data));
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
      Logger.error("🤔 Hmmm! There is no package.json file in your project. Please create one.");
      return null;
    }
  }

  async createDraftTheme() {
    console.log("✨ Preparing your testing theme ...");
    const { repo_url, theme_name, theme_id } = this.configs();
    return (await this.sallaApi())
      .request("new_draft", {
        repo_url: repo_url,
        name: theme_name,
        theme_id: theme_id,
      })
      .then((response) => response.data);
  }
}

module.exports = Watch;
