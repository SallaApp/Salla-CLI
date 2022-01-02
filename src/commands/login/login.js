const Logger = require("../../utils/LoggingManager");
const { SallaAuthAPI } = require("../../utils/AuthManager")();
const generateRandom = require("../../helpers/generateRandom");
require("@salla.sa/websocket");
const { AuthManager } = require("../../utils/AuthManager")();

module.exports = async function (options) {
  let randromIdentify = generateRandom(64);
  let connectionToken = await SallaAuthAPI.generateConnectionTokenEndpoint(
    randromIdentify
  );

  // TODO: nabil here
  Logger.info("ℹ️ To complete the login process, you will be redirected to your browser to signin with your Salla Partner account.");
  Logger.longLine();
  const load = Logger.loading("Waiting for authentication ...");

  setTimeout(() => {
    require("open")(BASE_URL + "/auth/cli?identify=" + randromIdentify);
  }, 2000);
  Salla.websocket
    .init({
      connectionEndpoint: WS_ENDPOINT + "/connection/websocket",
      //authEndpoint: "/connection/websocket/",
      connectionToken: connectionToken,
      debug: false,
      websocket: require("ws"),
    })
    .connect()

    .subscribe("cli-auth#" + randromIdentify, async (event) => {
      const data = event.data;
      load.stop();

      if (data.data["accessToken"]) {
        // store the token in the auth file

        await AuthManager.saveNewToken(data.data["accessToken"]);
        Logger.succ(
          `👋 Howdy ${data.data["name"]} ! You have landed successfully at Salla CLI 🤓`
        );
        process.exit(1);
      } else {
        Logger.error(
          `🛑 Oops! There is an error logging to Salla. Please try loggin again by running the following command: salla login`
        );
        Logger.printVisitTroubleshootingPageAndExit();
      }
    });
};
