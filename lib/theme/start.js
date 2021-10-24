const ThemeCommand = require('./ThemeCommand')
const {Octokit} = require("@octokit/rest");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");
const {execSync} = require("child_process");

class Start extends ThemeCommand {

    async run(cliOptions = {}) {
        if (this._ConfigManager.isExists()) {
            this.success("Theme is exists.");
            execSync("salla theme watch --skip-start", {stdio: "inherit"});
            return;
        }

        this._isEmptyDir = this.isEmptyDirectory();
        const currentThemeConfig = await this.readThemeConfig();
        const defaultAnswers = this.getDefaultAnswers(currentThemeConfig);
        const questions = this.getQuestions(defaultAnswers, cliOptions);
        const answers = await this.askQuestions(questions);
        answers.themeName = answers.themeName.replace(/\s/g,'_'); //replace spaces to underscore
        const themeConfig = this.applyAnswers(
            currentThemeConfig,
            answers,
            cliOptions
        );

        //set configPath of theme.json into sub folder
        this.inSubFolder = this.isInSubFolder(answers.themeName);
        if (this.inSubFolder) {
            this._ConfigManager.themePath = this.path().join(this._ConfigManager.themePath, answers.themeName)
            this._ConfigManager.configPath = this.path().join(this._ConfigManager.themePath, this._ConfigManager.configFileName);
        }

        await this.cloneRepo(answers.themeName).then(() => this._ConfigManager.save(themeConfig));

        if (!this.inSubFolder) {
            return this.runThemeCommand('watch --skip-start')
        }
        this.log(
            "✓ You are now ready to go! To test your theme just run:\n".green
            + ("  $ cd " + answers.themeName.bold + "\n").cyan
            + ("  $ salla theme watch").cyan
        );
    }

    /**
     * Current theme is in subFolder, when:
     * - it's not empty dir.
     * - themeName not same as current folder name.
     * - current folder name with spaces.
     *
     * @param {string} themeName
     * @return {boolean}
     */
    isInSubFolder(themeName) {
        return !(this._isEmptyDir && themeName === this.path().basename(this.constants().THEME_PATH));
    }

    async cloneRepo(themeName) {
        this.log('  Downloading Base Theme, please wait...'.green);
        const latestRelease = await this.getTheLatestRelease();
        if (latestRelease.status === 404 || !latestRelease.data || !latestRelease.data[0]) {
            this.error("Failed to Get latest Release", latestRelease);
            throw '';
        }
        await this.getAndUnZip(latestRelease.data[0].zipball_url, themeName);
    }

    async getTheLatestRelease() {
        const octokit = new Octokit();
        return await octokit
            .request("GET /repos/{org}/{repo}/tags", {
                headers: this.authHeader(),
                org    : this.constants().BASE_THEME.org,
                // type: "private",
                repo: this.constants().BASE_THEME.repo,
            })
    }

    async getAndUnZip(url, themeName) {
        const target = this.inSubFolder ? this.path().join(this.constants().THEME_PATH, themeName) : this.constants().THEME_PATH;
        //TODO:: add progress bar
        const response = await fetch(url, {headers: this.authHeader()});
        if (!response.ok) {
            this.error('Failed to get base theme.');
            console.error(await response.json());
            throw 'Failed to get base theme );';
        }

        this.success('Base theme downloaded');
        this.log('  Extracting base theme files...'.green);
        const zip = new AdmZip(await response.buffer());
        //const entries = zip.getEntries();
        const mainEntry = zip.getEntries()[0].entryName;
        zip.extractAllTo(/*target path*/ target, /*overwrite*/ false);
        const srcDir = this.path().join(target, mainEntry);
        this.fileSys().copySync(srcDir, target, {overwrite: false}, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!");
            }
        });
        this.fileSys().removeSync(srcDir);
        this.success('Base theme is ready.');
        return true;
    }

    async readThemeConfig() {
        let parsedConfig;
        try {
            parsedConfig = await this._ConfigManager.read();
        } catch (err) {
            this.log(`********** Building New ${'Salla'.bold} Theme **********`.green);
        }
        return parsedConfig || {};
    }

    getDefaultAnswers(sallaConfig) {
        return {
            themeName : sallaConfig.themeName || this.getDefaultThemeName(),
            author    : sallaConfig.author || '',
            email     : sallaConfig.email || '',
            supportUrl: sallaConfig.supportUrl || '',
        };
    }

    /**
     * Get current folder name as default theme name, only if it's empty directory
     * @return {undefined|string}
     */
    getDefaultThemeName() {
        return this._isEmptyDir ? this.path().basename(this.constants().THEME_PATH).replace(' ', '-') : undefined;
    }

    isEmptyDirectory(path) {
        return !this.fileSys().readdirSync(path || this.constants().THEME_PATH).filter(file => !['.DS_Store', '.idea'].includes(file)).length;
    }

    getQuestions(defaultAnswers, cliOptions) {
        const prompts = [];

        if (!cliOptions.themeName) {
            prompts.push({
                type    : "input",
                name    : "themeName",
                message : "What you want to call your theme ?",
                validate: (val) => /^[a-zA-Z0-9\s_-]+$/.test(val) || "You must enter a Valid name",
                default : defaultAnswers.themeName,
            });
        }

        if (!cliOptions.author) {
            prompts.push({
                type   : "input",
                name   : "author",
                message: "What is the author name ?",
                // validate: (val) => /^[a-zA-Z]+$/.test(val) || "You must enter a Valid name",
                default: defaultAnswers.author,
            });
        }

        if (!cliOptions.email) {
            prompts.push({
                type   : "input",
                name   : "email",
                message: "What is your email ?",
                // validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "You must enter an email",
                default: defaultAnswers.email,
            });
        }

        if (!cliOptions.supportUrl) {
            prompts.push({
                type   : "input",
                name   : "supportUrl",
                message: "What is your support url ?",
                // validate: (val) => /^https?:\/\//.test(val) || "You must enter a URL",
                default: defaultAnswers.supportUrl,
            });
        }

        return prompts;
    }

    /**
     * @param {{object[]}} questions
     * @returns {Promise<object>}
     */
    async askQuestions(questions) {
        return questions.length ? this.inquirer().prompt(questions) : {};
    }

    /**
     * @param {object} sallaConfig
     * @param {object} answers
     * @param {object} cliOptions
     * @returns {object}
     */
    applyAnswers(sallaConfig, answers, cliOptions) {
        const defaultValue = {
            version  : "1.0.0",
            themeName: "",
            repo_url : "",
            themeId  : "",
            defaults : {
                "primary-color"  : "#dddddd",
                "secondary-color": "#cccccc",
            },
        };
        const newConfig = {
            ...defaultValue,
            ...sallaConfig,
        };

        return {
            ...newConfig,
            ...cliOptions,
            ...answers,
        };
    }
}

module.exports = Start;
