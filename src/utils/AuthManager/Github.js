// * @property {Octokit|undefined} gitApi
const { Octokit } = require("@octokit/rest");
const Logger = require("../LoggingManager");
const InputsManager = require("../../utils/InputsManager");
const fs = require("fs-extra");
const { execSync } = require("child_process");
/**
 * @typedef {{access_token: string, login: string,email: string}} GithubConfig
 */
class GithubAPI {
  GithubConfig;
  gitSimple;
  AuthManager;
  constructor() {
    this.gitSimple = require("simple-git/promise")({ baseDir: BASE_PATH });
  }
  setGithubConfigData(GithubConfig) {
    this.GithubConfig = GithubConfig;
  }
  setAuthManager(AuthManager) {
    this.AuthManager = AuthManager;
  }
  createRepo({ repo_url, access_token, repo_name, isPrivate, message }) {
    return this.gitSimple
      .init()
      .then(() => this._createRepo({ access_token, repo_name, isPrivate }))
      .then(() => this.gitSimple.addRemote("origin", repo_url + ".git"));
  }
  /**
   *
   * @param  {GithubConfig} GithubConfig
   */
  async _createRepo({ access_token, repo_name, isPrivate }) {
    try {
      await new Octokit({
        auth: `token ${access_token}`,
      }).repos.createForAuthenticatedUser({
        name: repo_name,
        private: isPrivate,
      });
      Logger.success("🎉 Hooray! Your Github repository is created successfully.");
    } catch (err) {
      let errorMessage = err.message.includes("name already exists")
        ? `Github repository (${repo_name}) already exists.`
        : `Failed to create github repository, ${err.name}: ${err.message}`;
      Logger.error(errorMessage);
      throw err;
    }
  }

  getGit() {
    if (this.gitApi) {
      return this.gitApi;
    }
    return (this.gitApi = new Octokit({
      auth: `token ${this.GithubConfig.access_token}`,
    }));
  }

  async getUser() {
    try {
      let user = (await this.getGit().request("GET /user")).data;
      return user;
    } catch (err) {
      return null;
    }
  }

  async getTagName(minor) {
    return (
      (await this.gitSimple
        .tags()
        .then((data) => {
          if (data.latest) {
            const latestTagV = data.latest.split(".").reverse();
            if (minor) {
              latestTagV[1] = Number(latestTagV[1]) + 1;
              latestTagV[0] = 0;
            } else {
              latestTagV[0] = Number(latestTagV[0]) + 1;
            }
            return latestTagV.reverse().join(".");
          }
        })
        .catch((e) => "1.0.0")) || "1.0.0"
    );
  }
  async getGitName() {
    return execSync("git config user.name").toString().replace("\n", "");
  }
  async getGitEmail() {
    return execSync("git config user.email").toString().replace("\n", "");
  }
  async addAndCommit({ path, message, tagName }) {
    return this.gitSimple
      .add(path || "./*")
      .then(() => this.gitSimple.commit(message))
      .then(() => Logger.succ(`✅ New Version: ${tagName}`))

      .then(() => this.gitSimple.addTag(tagName))
      .then(() => this.gitSimple.pushTags("origin", "master"))
      .then(() => this.gitSimple.push("origin", "master"));
  }
  async checkChanges() {
    Logger.info(
      "ℹ️ Please make sure you have made all the changes you want to commit, and check for any changed and uncommitted files"
    );
    const status = await this.gitSimple.status();
    const checked = status.files.length > 0;
    if (checked) {
      Logger.info(`Find ${status.files.length} uncommitted files:`);
      // Logger.info(`Find ${status.files.length} file changes:`);
      console.table(
        status.files.map((file) => ({
          type: file.working_dir,
          file: file.path,
        }))
      );
    }
    return checked;
  }
  async isTokenValid(github) {
    try {
      /**
       * @see https://docs.github.com/en/rest/reference/users#get-the-authenticated-user--code-samples
       * @type {{login:string, id:number, email:string, name:string, ...}}
       */
      let user = await this.getUser();
      if (github.login !== user.login) {
        github.login = user.login;
        await this.AuthManager.set({
          login: user.login,
        });
      }

      return true;
    } catch (err) {
      return false;
    }
  }
  askForGithubToken() {
    let github_token = InputsManager.readLine("Github token: ", {
      name: "github_token",
    });
    return github_token;
  }
  /**
   *
   * @param  {GithubConfig} GithubConfig
   * @return {Promise<void>}
   */
  async initiateRepo({ message, isPrivate }) {
    if (!this.GithubConfig) {
      let configData = fs.existsSync(CLI_CONFIG_FILE)
        ? require(CLI_CONFIG_FILE)
        : null;

      this.GithubConfig = configData.github || {};
      if (!(await this.isTokenValid(configData.github))) {
        let github_token = await this.askForGithubToken();
        this.GithubConfig.access_token = github_token;

        await this.AuthManager.set({
          github: github_token,
        });
        let user = await this.getUser();

        this.GithubConfig.login = user.login;

        await this.AuthManager.set({
          login: login,
        });
      }
    }
    const repoName = InputsManager.readLine("? Repository Name:", {
      validate: /^[a-zA-Z0-9\s_-]+$/,
      name: "repository name",
    });

    Logger.succ(
      `✨ Initializing a new Github repository (${repoName}) for you. On the way ☕️`
    );
    const remoteRepo = `https://github.com/${this.GithubConfig.login}/${repoName}`;

    try {
      await this.createRepo({
        repo_url: remoteRepo,
        repo_name: repoName,
        message,
        isPrivate,
        ...this.GithubConfig,
      });
      return { remoteRepo, repoName };
    } catch (err) {
      Logger.error(`🤔 Hmmm! Something went wrong. ${err.message}`);

      fs.removeSync(".git");
      return null;
    }
  }
}

module.exports = GithubAPI;
