const BaseClass = require('./utils/BaseClass');
const WebDevServer = require("web-dev-server");

/**
 * @property {ServeOptions} options
 */
class Serve extends BaseClass {

    /**
     * @return {Promise<null>}
     */
    async run() {
        this.log('  Creating local server to serve assets...'.green);
        return WebDevServer.Server.CreateNew()
            .SetDocumentRoot(this.path().join(BASE_PATH, "assets"))
            .SetPort(this.options.port || ASSETS_PORT)
            .Start((success, err) => {
                if (!success) {
                    this.error(err);
                    this.log(`\nUse another port, then run ` + "salla theme watch --port <your_new_port>".yellow)
                    return null;
                } 
                this.success("Server is running.");
            });
    }
}

module.exports = Serve;
