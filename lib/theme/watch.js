const BaseClass = require('./utils/BaseClass');
const open = require("open");
const {exec} = require('child_process')
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
        exec(`salla theme serve --port=${assetsPort}`);

        response.preview_url += "&assets_url=http://localhost:" + assetsPort;
        this.success("Preview Url:", response.preview_url)
        open(response.preview_url);

        let packageManager = undefined;
        if (await commandExists('yarn')) {
            packageManager = 'yarn'
        } else if (await commandExists('npm')) {
            packageManager = 'npm';
        }
        if (!await this.fileSys().pathExists(process.cwd() + '/node_modules')) {
            this.error('Folder (node_modules) is not exists! It looks that you didn\'t run (' + (packageManager + ' install').bold + ') yet.')
            return null;
        }

        let packageJs = this.packageData();
        if (!packageJs) {
            return null;
        }
        // check if watch defined in package.json
        if (!packageJs.scripts.hasOwnProperty("watch")) {
            this.warn("There is no watch script in package.json");
            return null;
        }

        if (!packageManager) {
            this.error("Cloud not find " + "yarn/npm".bold + " in your system!");
            return null;
        }

        packageManager += packageManager === 'npm' ? ' run' : ' add';
        this.log(`  running '${packageManager} watch'...`.green);
        this.runSysCommand(packageManager + ' watch');
        //let npmWatch = exec(packageManager + ' watch'); //don't run it sync to avoid server stop serving
        //npmWatch.stdout.on('data', data => console.log(data));
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