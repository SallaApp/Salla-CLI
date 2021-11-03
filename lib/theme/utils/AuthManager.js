require("colors");
const SallaApi = require('../../api/SallaApi');
const BaseClass = require("./BaseClass");
const {Octokit} = require("@octokit/rest");

/**
 * @typedef {{
 *            salla     : {access_token: string, store_id: number, store_url: string},
 *            github    : {access_token: string, login: string|undefined},
 *            BASE_URL  : string|undefined
 *          }} SallaConfig
 */
/**
 *
 * @property {undefined|SallaConfig} configData
 * @property {Octokit|undefined} gitApi
 * @property {boolean|undefined} skip_tokens_check -to be avoid re checking valid tokens
 */
class AuthManager extends BaseClass {

    /**
     * @param {boolean|undefined} withoutForce - avoid infinite loop when self call
     * @return {Promise<SallaConfig>}
     */
    async tokens(withoutForce = false) {
        if (this.configData) {
            return this.configData;
        }
        try {

            this.configData = this.fileSys().existsSync(CLI_CONFIG_FILE)
                ? require(CLI_CONFIG_FILE)
                : undefined;

            if (this.configData && await this.isConfigValid(this.configData)) {
                this.skip_tokens_check = true;//no need to recheck
                return this.configData;
            }
        } catch (error) {
            this.error(`Failed to read: ${CLI_CONFIG_FILE}\n${error.name}:${error.message}`);
        }
        this.configData = undefined;

        if (withoutForce) {
            return null;
        }

        let authPort = this.commandName === 'auth' && this.options.port ? ' --port ' + this.options.port : '';
        this.runTheme(`auth --force ${authPort}`)
        this.skip_tokens_check = true;
        setTimeout(() => this.readyToReturn = true, 1000);
        await this.checkIsReadyToReturn();
        return await this.tokens(/*withoutForce*/ true);
    }

    /**
     * @param {object|SallaConfig} token
     * @param withLog
     */
    async save(token, withLog = true) {

        if (!await this.fileSys().existsSync(CLI_CONFIG_DIR)) {
            await this.fileSys().mkdirSync(CLI_CONFIG_DIR, {
                recursive: true,
            });
        }

        //to be allow separate url for each salla developer
        if (!token.BASE_URL) {
            token.BASE_URL = BASE_URL;
        }
        return this.fileSys().writeFile(CLI_CONFIG_FILE, JSON.stringify(token, null, 2), (err) => {
            if (err) return console.error(err);
            if (withLog) {
                console.log(("✓ Token stored to: " + CLI_CONFIG_FILE).green);
            }
        });
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
            this.canLog() && this.success("Salla token is valid.");
            return true;
        }

        this.error("Salla token is invalid!");
        return false;
    }

    canLog() {
        return this.commandName === "auth";
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
                await this.save(this.configData, false);
            }

            this.canLog() && this.success("Github token is valid.")
            return true;
        } catch (error) {
            let message = error && error.message ? `${error.name}: ${error.message}` : 'Unknown!';
            this.error(`Github token is invalid! (${message})`);
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


    /**
     * @param {string} key
     * @param {JsonValue|JsonValue[]} value
     */
    async set(key, value) {
        const config = await this.tokens(true);
        config[key] = value;
        await this.save(config, false);
    }

}

module.exports = AuthManager;