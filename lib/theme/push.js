const path = require("path");
const simpleGit = require("simple-git/promise");
const git = simpleGit();
const repoName = path.basename(path.resolve());
const { execSync } = require("child_process");
const { Octokit } = require("@octokit/rest");
const AuthenticationManager = require("./utils/AuthenticationManager");
const ConfManager = require("./utils/ConfigManager");

class ThemePush {
  constructor({
    ConfigManager = new ConfManager(),
    AuthManager = new AuthenticationManager(),
    logger = console,
  } = {}) {
    this._ConfigManager = ConfigManager;
    this._AuthManager = AuthManager;
    this._logger = logger;
  }

  async run(cliOptions = {}) {
    if (cliOptions.soft) {
      const TOKEN = (await this._AuthManager.read()).github["access-token"];
      const octokit = new Octokit({
        auth: `token ${TOKEN}`,
      });
      const loginName = await this.userInformation(octokit);
      const remoteRepo = `https://github.com/${loginName}/${repoName}.git`;
      const tagName = await this.getTagName();

      git.checkIsRepo().then((isRepo) => {
        if (!isRepo) {
          console.log(
            `We are going to create repository in your github account ${loginName}, please wait....`
          );
          try {
            git
              .init()
              .then(() => this.createRepo(octokit))
              .then(() => git.add("./*"))
              .then(() => git.commit("first commit!"))
              .then(() => git.addRemote("origin", remoteRepo))
              .then(() => git.addTag(tagName))
              .then(() => git.pushTags("origin", "master"))
              .then(() => git.push("origin", "master"))
              .then(() => this.savegRepositoryUrl(remoteRepo));
          } catch (err) {
            console.error("create github repository ", err);
          }
        } else {
          console.log("There is a repo");
          //  git.add('./*')
          // .then(() =>  git.commit("first commit!")) // todo change the text
          // .then(() =>  git.addTag(this.getRandomName()))
          // .then(() =>  git.pull('origin', 'master')) // todo pull from github
          // .then(() =>  git.pushTags('origin', 'master'))
          // .then(() =>  git.push('origin', 'master'))
        }
      });
    } else {
      //run command without --soft
      console.log("run command without --soft");
    }
  }

  async createRepo(octokit) {
    try {
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: true,
      });
    } catch (err) {
      console.error("createRepo", err.message);
    }
  }

  async userInformation(octokit) {
    const githubUser = await octokit.request("GET /user");
    return githubUser.data.login;
  }

  async checkChanges() {
    console.log("Check for changed and uncommitted files");
    const status = await git.status();
    const checked = status.files.length > 0;
    if (checked) {
      console.info(`Find ${status.files.length} file changes:`);
      console.table(
        status.files.map((file) => ({
          type: file.working_dir,
          file: file.path,
        }))
      );
    }
    return checked;
  }

  getRandomName() {
    return (Math.random() + 1).toString(36).substring(7);
  }

  async getTagName() {
    const tagName = git
      .tags()
      .then((data) => {
        if (data.latest) {
          const currntTag = data.latest.split(".").reverse();
          currntTag[0] = Number(currntTag[0]) + 1;
          const newTag = currntTag.reverse().join(".");
          return newTag;
        }
      })
      .catch((e) => {
        // console.log(e);
        return "1.0.0";
      });
    return tagName != "undefined" ? tagName : "1.0.0";
  }

  savegRepositoryUrl(remoteRepo) {
    this._ConfigManager.addItem("repo_url", remoteRepo);
  }
}

module.exports = ThemePush;
