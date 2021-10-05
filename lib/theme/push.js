const path = require("path");
const simpleGit = require('simple-git/promise');
const git = simpleGit()
const repoName =  path.basename(path.resolve())
const { execSync } = require('child_process')
const {Octokit} = require("@octokit/rest");
const TOKEN = "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" // for testing  //tahaabdoh account
const octokit = new Octokit({
    auth: `token ${TOKEN}`
});





class ThemePush {
    // constructor(props) {
    //     //super(props);
    // }
  
    async run(cliOptions = {}) {
        if (cliOptions.soft) {
            git.checkIsRepo().then(isRepo => {
                if (!isRepo) {
                    git.init()
                    this.createRepo()
                    git.add('./*')
                    git.commit("first commit!")
                    git.addRemote('origin', `https://github.com/tahaabdoh/${repoName}.git`)  //todo getting username
                    git.addTag(this.getRandomName())
                    git.pushTags('origin', 'master');
                    git.push('origin', 'master');
                } else {
                    console.log("There is a repo")
                    git.add('./*')
                    git.commit("first commit!") // todo change the text
                    git.addTag(this.getRandomName())
                  //git.pull('origin', 'master')  // todo pull from github
                    git.pushTags('origin', 'master');
                    git.push('origin', 'master');
                }
            })

        }else{
            //todo run command without --soft
            console.log("todo run command without --soft")
        }
    }

    async createRepo() {
        try {
            const {
                data
            } = await octokit.repos.createForAuthenticatedUser({
                name: repoName,
            });
            // console.log(data);
        } catch (err) {
            console.error("createRepo", err);
        }
    }


    async checkChanges() {
        console.log('Check for changed and uncommitted files');
        const status = await git.status();
        const checked = status.files.length > 0;
        if (checked) {
            console.info(`Find ${status.files.length} file changes:`);
            console.table(status.files.map(file => ({
                type: file.working_dir,
                file: file.path
            })));
        }
        return checked;
    }

    getRandomName() {
        return (Math.random() + 1).toString(36).substring(7)
      }
    }

module.exports = ThemePush;