/**
 * @typedef {{prompts?: {}, Separator?: Separator|{}, ui?: {BottomBar: BottomBar, Prompt: PromptUI}, createPromptModule?: function(*=): function(*=): *, prompt?: *, registerPrompt?: function(*=, *=): void, restoreDefaultPrompts?: function(): void}} Inquirer
 */
/**
 * @typedef {{repo_url: string, themeName: string, defaults: {"primary-color": string, "secondary-color": string}, author: string, supportUrl: string, themeId: string, version: string, email: string}} ThemeConfigs
 */
require("colors");
const ConfManager = require("./utils/ConfigManager");
const SallaApi = require("../api/SallaApi")
const {execSync} = require('child_process')

/**
 * @property {ThemeConstants} constants
 * @property {SallaConfig} tokens
 * @property {SallaApi} _sallaApi
 * @property {FileSystem|undefined} _fse
 * @property {Inquirer|undefined} _inquirer
 * @property {Inquirer|undefined} _configs
 */
class ThemeCommand {
    constructor() {
        //TODO:: convert it to function configs() same as getTokens()
        this._ConfigManager = new ConfManager();
        this.readyToReturn = false;
    }

    /******* Common Helper Classes & Objects *******/
    fileSys() {
        if (this._fse) {
            return this._fse;
        }
        return this._fse = require("fs-extra");
    }

    /**
     * @return {Inquirer}
     */
    inquirer() {
        if (this._inquirer) {
            return this._inquirer;
        }
        return this._inquirer = require("inquirer");
    }

    /**
     * @return {ThemeConstants}
     */
    constants() {
        if (this._constants) {
            return this._constants;
        }
        return this._constants = require("../../constants");
    }

    /**
     * You can pass message directly like : logger('message')
     * Or get logger then call it like    : logger()->error('message')
     * @return {Console|console}
     */
    log() {
        if (this._logger) {
            return arguments.length ? this._logger.log(...arguments) : this._logger;
        }
        this._logger = console;
        return this.log(...arguments);
    }

    path() {
        if (this._path) {
            return this._path;
        }
        return this._path = require("path");
    }


    /**
     * @param {boolean} skip_tokens_check
     * @return {Promise<SallaApi>}
     */
    async sallaApi(skip_tokens_check = false) {
        if (this._sallaApi) {
            return this._sallaApi;
        }
        this._sallaApi = new SallaApi();
        this._sallaApi.accessToken = (await this.getTokens(skip_tokens_check)).salla.access_token;
        return this._sallaApi
    }

    /**
     *
     * @param skip_tokens_check - in case we already checked the tokens, don't check them again
     * @return {Promise<SallaConfig>}
     */
    async getTokens(skip_tokens_check = false) {
        if (this.tokens) {
            return this.tokens;
        }
        return this.tokens = await this.auth(skip_tokens_check).tokens();
    }

    auth(skip_tokens_check) {
        if (this._auth) {
            this._auth.skip_tokens_check = skip_tokens_check;
            return this._auth;
        }
        this._auth = new (require("./utils/AuthenticationManager"))();
        return this.auth(skip_tokens_check);
    }

    /******* End Helpers Classes & Objects *******/

    //for testing proposes
    authHeader() {
        return {
            authorization: "token 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",
        };
    }

    /******* Common Helper Methods *******/
    runThemeCommand(command) {
        return this.runSysCommand('salla theme ' + command);
    }

    runSysCommand(command) {
        return execSync(command, {stdio: 'inherit'});
    }

    openBrowser(url) {
        return require("open")(url);
    }


    /**
     * make a loop of checking until finding try
     * @return {Promise<unknown>}
     */
    checkIsReadyToReturn() {
        let that = this;
        return new Promise(resolve => setInterval(function () {
            if (that.readyToReturn) {
                resolve();
                clearInterval(this);
            }
            //TODO:: set timeout
        }, 100));
    }

    //Logging
    success(message, ...additionalData) {
        this.log(`✓ ${message}`.green, ...additionalData);
    }

    error(message, ...additionalData) {
        this.log(`X ${message}`.red, ...additionalData);
    }

    warn(message, ...additionalData) {
        this.log().warn(`! ${message}`.yellow, ...additionalData);
    }

    //todo: one place for log debug, when developing we can add -v for more debugging
    debug() {
        this.log(...arguments);
    }

    /******* End Common Helper Methods *******/
}

module.exports = ThemeCommand;