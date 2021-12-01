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
  constructor() {
    this.gitSimple = require("simple-git/promise")({ baseDir: BASE_PATH });
  }
  setGithubConfigData(GithubConfig) {
    this.GithubConfig = GithubConfig;
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
      Logger.success("Github repository created.");
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
      .then(() => Logger.succ(`New Version: ${tagName}`))

      .then(() => this.gitSimple.addTag(tagName))
      .then(() => this.gitSimple.pushTags("origin", "master"))
      .then(() => this.gitSimple.push("origin", "master"));
  }
  async checkChanges() {
    Logger.info("Check for changed and uncommitted files");
    const status = await this.gitSimple.status();
    const checked = status.files.length > 0;
    if (checked) {
      Logger.info(`Find ${status.files.length} file changes:`);
      console.table(
        status.files.map((file) => ({
          type: file.working_dir,
          file: file.path,
        }))
      );
    }
    return checked;
  }

  /**
   *
   * @param  {GithubConfig} GithubConfig
   * @return {Promise<void>}
   */
  async initiateRepo({ message, isPrivate }) {
    if (!this.GithubConfig) {
      // this.setConfigData
      Logger.error(`Please set the config data first.`);
      return;
    }
    const repoName = InputsManager.readLine(
      "What do you want to call your repository ? ",
      { validate: /^[a-zA-Z0-9\s_-]+$/, name: "repository name" }
    );

    Logger.succ(
      `  Initiating repository in github (${this.GithubConfig.login}), please wait....`
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
      Logger.error(`Failed to initiate Git repo, ${err.name}: ${err.message}`);
      fs.removeSync(".git");
      return null;
    }
  }
}

module.exports = GithubAPI;
