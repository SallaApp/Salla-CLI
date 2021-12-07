const BaseClass = require("./utils/BaseClass");
const { AuthManager, GithubAPI } = require("../utils/AuthManager")();

const Logger = require("../utils/LoggingManager");

/**
 * @typedef {{access_token: string, login: string}} GithubConfig
 */

class Push extends BaseClass {
  /**
   * @param {{force:boolean|undefined, token:string|undefined, name:string|undefined , message:string|undefined , minor:boolean|undefined}} options
   * @return {Promise<void>}
   */
  async run(options = {}) {
    this.options = options;
    /**
     * @type {GithubConfig}
     */
    const github =
      options.token && options.name
        ? { access_token: options.token, login: options.name }
        : (await this.getTokens()).github;

    GithubAPI.gitSimple.checkIsRepo().then(async (isRepo) => {
      if (isRepo) {
        //this.success("Git repo existed.");
        this.pushChanges("✨ New Awesome Developing Session", options.force);
        return;
      }
      Logger.warn("Git repo not existed yet.");

      await this.initiateRepo(github);
    });
  }

  /**
   *
   * @param  {GithubConfig} github
   * @return {Promise<void>}
   */
  async initiateRepo(github) {
    let result = await GithubAPI.initiateRepo({
      message: "🎉 New Awesome Theme For 🛒",
      isPrivate: true,
      ...github,
    });
    if (result) {
      this.configManager().set("repo_url", result.remoteRepo);
      this.repoName = result.repoName;
      this.pushChanges("✨ New Awesome Developing Session", true);
    }
  }

  /**
   * @param {string} message
   * @param {boolean} force
   * @return {Promise<void>}
   */
  async pushChanges(message, force = false) {
    let files = (await GithubAPI.gitSimple.diffSummary()).files;
    if (
      !force &&
      !this.options.force &&
      !files.filter((file) => file.file.toLowerCase().endsWith(".twig")).length
    ) {
      // this.success('There is no changes in twig files.');
      return;
    }
    let tagName = await GithubAPI.getTagName(this.options.minor);

    GithubAPI.addAndCommit({
      path: "./*",
      message: this.options.message || message,
      tagName,
    })
      .then(
        () =>
          files.length > 10 &&
          Logger.info(`  Pushing (${files.length}) files  into git repo...`)
      )
      .then(() =>
        Logger.success(
          `Whoop! All done! Your files has been pushed to Github successfully.`
        )
      );
  }
}

module.exports = Push;
