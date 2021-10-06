const path = require("path");
const simpleGit = require("simple-git/promise");
const git = simpleGit();
const repoName = path.basename(path.resolve());
const { execSync } = require("child_process");
const { Octokit } = require("@octokit/rest");
const AuthenticationManager = require("./utils/AuthenticationManager");
//const TOKEN = "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"; // for testing  //tahaabdoh account

class ThemePush {
  constructor({
    AuthManager = new AuthenticationManager(),
    logger = console,
  } = {}) {
    this._AuthManager = AuthManager;
    this._logger = logger;
  }

  async run(cliOptions = {}) {
    if (cliOptions.soft) {
      const loginName = await this.userInformation();
      git.checkIsRepo().then((isRepo) => {
        if (!isRepo) {
          git
            .init()
            .then(() => this.createRepo())
            .then(() => git.add("./*"))
            .then(() => git.commit("first commit!"))
            .then(() =>
              git.addRemote(
                "origin",
                `https://github.com/${loginName}/${repoName}.git`
              )
            ) 
            .then(() => git.addTag(this.getRandomName()))
            .then(() => git.pushTags("origin", "master"))
            .then(() => git.push("origin", "master"));
        } else {
          console.log("todo There is a repo");
          //  git.add('./*')
          // .then(() =>  git.commit("first commit!")) // todo change the text
          // .then(() =>  git.addTag(this.getRandomName()))
          // .then(() =>  git.pull('origin', 'master')) // todo pull from github
          // .then(() =>  git.pushTags('origin', 'master'))
          // .then(() =>  git.push('origin', 'master'))
        }
      });
    } else {
      //todo run command without --soft
      console.log("todo run command without --soft");
    }
  }

  async createRepo() {
    const TOKEN = (await this._AuthManager.read()).github["access-token"];
    try {
      const octokit = new Octokit({
        auth: `token ${TOKEN}`,
      });
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
      });
      // console.log(data);
    } catch (err) {
      console.error("createRepo", err);
    }
  }

  async userInformation() {
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
}

module.exports = ThemePush;
