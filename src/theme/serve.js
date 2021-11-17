const BaseClass = require('./utils/BaseClass');
const Servino = require('../packages/devServer/servino');


/**
 * @property {ServeOptions} options
 */
class Serve extends BaseClass {

    /**
     * @return {Promise<null>}
     */
    async run() {
        this.log('> Creating local server to serve assets...'.green);

        Servino.start({
            port: this.options.port || ASSETS_PORT,
            root: this.options.assets || 'assets', // todo :: make it dynamic
            verbose: true
        }).on('listening', () => {
            this.success("Local server is running.");
        });
    }
}

module.exports = Serve;
