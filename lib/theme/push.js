const BaseClass = require('./utils/BaseClass');
const path = require("path");
const git = require("simple-git/promise")({baseDir: BASE_PATH});
const repoName = path.basename(path.resolve());
const {Octokit} = require("@octokit/rest");

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
        const github = (options.token && options.name)
            ? {access_token: options.token, login: options.name}
            : (await this.getTokens()).github;

        git.checkIsRepo().then(isRepo => {
            if (isRepo) {
               //this.success("Git repo existed.");
                this.pushChanges("✨ New Awesome Developing Session", options.force)
                return;
            }
            this.warn("Git repo not existed yet.");
            this.initiateRepo(github);
        });
    }

    /**
     *
     * @param  {GithubConfig} github
     * @return {Promise<void>}
     */
    async initiateRepo(github) {
        console.log(`  Initiating repository in github (${github.login}), please wait....`.green);
        const remoteRepo = `https://github.com/${github.login}/${repoName}`;
        try {
            await (git
                .init()
                .then(() => this.createRepo(github))
                .then(() => git.addRemote("origin", remoteRepo + '.git'))
                .then(() => this.pushChanges("🎉 New Awesome Theme For 🛒", true))
                .then(() => this.configManager().set("repo_url", remoteRepo)));
        } catch (err) {
            this.error(`Failed to initiate Git repo, ${err.name}: ${err.message}`);
            this.fileSys().removeSync('.git');
        }
    }

    /**
     * @param {string} message
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async pushChanges(message, force = false) {
        if (!force && !this.options.force && !(await git.diffSummary()).files.filter(file => file.file.toLowerCase().endsWith('.twig')).length) {
            this.success('There is no changes in twig files.');
            return;
        }
        let tagName = await this.getTagName();
        git.add("./*")
            .then(() => git.commit(this.options.message || message))
            .then(() => this.success(`New Version: ${tagName}`))
            .then(() => git.addTag(tagName))
            .then(() => git.pushTags("origin", "master"))
            //.then(() => this.log('  Pushing files into git repo...'.green))
            .then(() => git.push("origin", "master"))
            .then(() => this.success(`Files pushed to GitHub repo (${repoName.bold}).`));
    }

    /**
     *
     * @param  {GithubConfig} github
     */
    async createRepo(github) {
        try {
            await (new Octokit({auth: `token ${github.access_token}`,}))
                .repos.createForAuthenticatedUser({
                    name   : repoName,
                    private: true,
                });
            this.success("Github repository created.");
        } catch (err) {
            let errorMessage = err.message.includes('name already exists')
                ? `Github repository (${repoName.bold}) already exists.`
                : `Failed to create github repository, ${err.name}: ${err.message}`;
            this.error(errorMessage);
            throw err;
        }
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

    async getTagName() {

        return (await git
            .tags()
            .then((data) => {
                if (data.latest) {
                    const latestTagV = data.latest.split(".").reverse();
                    if (this.options.minor){
                        latestTagV[1] = Number(latestTagV[1]) + 1;
                        latestTagV[0] = 0;
                    }else{
                        latestTagV[0] = Number(latestTagV[0]) + 1;
                    }
                    return latestTagV.reverse().join(".");
                }
            })
            .catch((e) => "1.0.0")) || "1.0.0";
    }
}

module.exports = Push;
