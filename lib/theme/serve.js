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
                    this.log(`\nPlease choose another port, and run this command with your custom port ` + "salla theme watch --port '0000'".yellow)
                    return null;
                } 
                this.success("Server is running.");
            }).GetErrorHandler((err,code) =>{
                console.log("err", err);
                console.log("code", code);
            });
    }
}

module.exports = Serve;
