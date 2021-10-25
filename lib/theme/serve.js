const BaseClass = require('./utils/BaseClass');
const WebDevServer = require("web-dev-server");
let assetsPort = ASSETS_PORT;



class Serve extends BaseClass {

    /**
     * @param {{port:number|undefined}} options
     * @return {Promise<null>}
     */
    async run(options) {
        if (options.port) {
            assetsPort = options.port;
        }

        this.log('  Creating local server to serve assets...'.green);
        return WebDevServer.Server.CreateNew()
            .SetDocumentRoot(this.path().join(BASE_PATH, "assets"))
            .SetPort(assetsPort)
            .Start((success, err) => {
                if (!success) this.error(err);
                this.success("Server is running.");
            });
    }
}

module.exports = Serve;
