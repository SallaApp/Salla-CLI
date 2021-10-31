const BaseClass = require('./utils/BaseClass');
const {exec, execSync} = require('child_process')
const commandExists = require('command-exists');

/**
 * @property {WatchOptions} options
 */
class Watch extends BaseClass {

    /**
     * @return {Promise<null>}
     */
    async run() {
        if (this.options.port) {
            process.env.ASSETS_PORT = this.options.port;
        }
        if (!this.options.skipStart) {
            this.runTheme('start');
            return null;
        }
        /**
         * @type {SallaConfig}
         */
        let tokens = await this.getTokens();
        this.runTheme(`push --token ${tokens.github.access_token} --name ${tokens.github.login}`);

        let packageManager = undefined;
        if (await this.isCommandExists('yarn')) {
            packageManager = 'yarn'
        } else if (await this.isCommandExists('npm')) {
            packageManager = 'npm';
        }
        if (!await this.fileSys().pathExists(this.path().join(BASE_PATH, 'node_modules'))) {
            this.log(`  running '${packageManager} install'...`.green);
            // this.error('Folder (node_modules) is not exists! It looks that you didn\'t run (' + (packageManager + ' install').bold + ') yet.')
            this.runSysCommand(packageManager + ' install')
            // return null;
        }

        let packageJs = this.packageData();
        if (!packageJs) {
            return null;
        }


        /**
         * @type {boolean|{preview_url:string, id:number}}
         */
        let response = await this.createDraftTheme();
        if (!response || !response.preview_url || !response.id) {
            this.error('Failed to create testing theme.');
            return null;
        }

        await this.configManager().set('draft_id', response.id);
        this.success('Testing theme created.');

        let assetsPort = this.options.port || process.env.ASSETS_PORT || ASSETS_PORT;
        let serve = exec(`salla theme serve --port=${assetsPort}`, {cwd: BASE_PATH});
        serve.stdout.on('data', data => {
            this.log(data = data.replace("\n", ''));
            if (data.toLowerCase().includes('error')) {
                return this.isNotReadyGoOut = true;
            }
            if (data.includes('Server is running.')) {
                this.readyToReturn = true;
            }
        });
        if (!await this.checkIsReadyToReturn()) {
            return null;
        }
        response.preview_url += "&assets_url=http://localhost:" + assetsPort;
        this.success("Preview Url:", response.preview_url)
        this.openBrowser(response.preview_url);


        // check if watch defined in package.json
        if (!packageJs.scripts.hasOwnProperty("watch")) {
            this.warn("There is no watch script in package.json");
            return null;
        }

        if (!packageManager) {
            this.error("Cloud not find " + "yarn/npm".bold + " in your system!");
            return null;
        }

        packageManager += packageManager === 'npm' ? ' run' : '';
        this.log(`  running '${packageManager} watch'...`.green);
        this.runSysCommand(packageManager + ' watch');
        //let npmWatch = exec(packageManager + ' watch'); //don't run it sync to avoid server stop serving
        //npmWatch.stdout.on('data', data => console.log(data));
    }

    async isCommandExists(command) {
        try {
            return await commandExists(command);
        } catch (error) {
            return false;
        }
    }

    packageData() {
        try {
            return require(process.cwd() + '/package.json');
        } catch (e) {
            // There was no package.json
            this.error("Can't find: package.json");
            return null;
        }
    }


    async createDraftTheme() {
        console.log('  Prepare testing theme...'.green);
        const {repo_url, theme_name, theme_id} = this.configs();
        return (await this.sallaApi()).request('new_draft', {
            repo_url: repo_url,
            name    : theme_name,
            theme_id: theme_id
        }).then(response => response.data);
    }
}

module.exports = Watch