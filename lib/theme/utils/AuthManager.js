require("colors");
const SallaApi = require('../../api/SallaApi');
const BaseClass = require("./BaseClass");
const dir = require("os").homedir() + "/.salla";
const {execSync} = require("child_process");
const {Octokit} = require("@octokit/rest");

/**
 * @typedef {{
 *            salla  :{access_token: string, store_id: number, store_url: string},
 *            github :{access_token: string, login: string|undefined}
 *          }} SallaConfig
 */
/**
 *
 * @property {undefined|SallaConfig} configData
 * @property {Octokit|undefined} gitApi
 * @property {boolean|undefined} skip_tokens_check -to be avoid re checking valid tokens
 */
class AuthManager extends BaseClass {
    authPath() {
        if (this._authPath) {
            return this._authPath;
        }
        return this._authPath = require("path").join(dir, "config.json")
    }

    /**
     * @param {boolean|undefined} withoutForce - avoid infinite loop when self call
     * @return {Promise<SallaConfig>}
     */
    async tokens(withoutForce = false) {
        if (this.configData) {
            return this.configData;
        }
        try {
            this.configData = require(this.authPath());
            if (await this.isConfigValid(this.configData)) {
                this.skip_tokens_check = true;//no need to recheck
                return this.configData;
            }
        } catch (e) {
            console.error(`X Failed to read: ${this._authPath}`.red)
        }
        if (withoutForce) {
            return null;
        }
        execSync("salla theme auth --force", {stdio: "inherit"})
        return await this.tokens(/*withoutForce*/ true);
    }

    /**
     * @param {object|SallaConfig} token
     * @param withLog
     */
    async save(token, withLog = true) {
        if (!await this.fileSys().existsSync(dir)) {
            await this.fileSys().mkdirSync(dir, {
                recursive: true,
            });
        }
        if (token.github) {
            token = JSON.stringify(token, null, 4)
        }
        await this.fileSys().writeFile(this._authPath, token, (err) => {
            if (err) return console.error(err);
            if (withLog) {
                console.log(("✓ Token stored to: " + this._authPath).green);
            }
            return true;
        });
        return true;
    }

    /**
     * @param {SallaConfig|undefined} configs
     * @return {boolean}
     */
    async isConfigValid(configs) {
        return this.skip_tokens_check || !!(configs && await this.isSallaTokenValid() && await this.isGithubTokenValid());
    }

    async isSallaTokenValid() {
        if (!this.configData.salla || !this.configData.salla.access_token) {
            return false;
        }
        let api = new SallaApi();
        api.accessToken = this.configData.salla.access_token;
        let user = await api.request('user');
        if (user && user.success) {
            console.log("✓ Salla token is valid.".green);
            return true;
        }
        console.log("X Salla token is invalid!".red);
        return false;
    }

    async isGithubTokenValid() {
        try {
            /**
             * @see https://docs.github.com/en/rest/reference/users#get-the-authenticated-user--code-samples
             * @type {{login:string, id:number, email:string, name:string, ...}}
             */
            let user = (await this.getGit().request("GET /user")).data;
            if (this.configData.github.login !== user.login) {
                this.configData.github.login = user.login;
                await this.save(this.configData);
            }

            console.log("✓ Github token is valid.".green)
            return true;
        } catch (error) {
            let message = `${error.name}: ${error.message}`;
            console.log(`X Github token is invalid! (${message})`.red);
            return false;
        }
    }

    getGit() {
        if (this.gitApi) {
            return this.gitApi;
        }
        return this.gitApi = new Octokit({
            auth: `token ${this.configData.github.access_token}`,
        });
    }
}

module.exports = AuthManager;