const BaseClass = require("./utils/BaseClass");
const Servino = require("../packages/devServer/servino");
const Logger = require("../utils/LoggingManager");

/**
 * @property {ServeOptions} options
 */
class Serve extends BaseClass {
  /**
   * @return {Promise<null>}
   */
  async run() {
    Logger.info("> Creating local server to serve assets...");

    Servino.start({
      port: this.options.port || ASSETS_PORT,
      root: this.options.assets || "assets", // todo :: make it dynamic
      verbose: true,
    }).on("listening", () => {
      
      Logger.success("Whoop! Local server is currently running.");
      // Logger.success("Whoop! Server is running on port " + ASSETS_PORT);
    });
  }
}

module.exports = Serve;
