const Logger = require("../utils/LoggingManager");
const { SallaAuthAPI } = require("../utils/AuthManager")();
const generateRandom = require("../helpers/generateRandom");
const Salla = require("@salla.sa/websocket");
const { AuthManager } = require("../utils/AuthManager")();

module.exports = async function (options) {
  let randromIdentify = generateRandom(64);
  let connectionToken = await SallaAuthAPI.generateConnectionTokenEndpoint(
    randromIdentify
  );

  // TODO :
  // Ask nabil for a instractions for auth in the browser

  const load = Logger.loading("Refreshing your accessToken ...");

  Salla.websocket
    .init({
      connectionEndpoint: WS_ENDPOINT + "/connection/websocket",
      //authEndpoint: "/connection/websocket/",
      connectionToken: connectionToken,
      debug: false,
    })
    .connect()

    .subscribe("cli-auth#" + randromIdentify, function (event) {
      const data = event.data;
      load.stop();

      switch (data.event) {
        case "authorization.token":
          if (data.data["accessToken"]) {
            // store the token in the auth file

            AuthManager.saveNewToken(data.data["accessToken"]);
            Logger.succ(
              `👋 Hello ${data.data["name"]} ! You have landed successfully at Salla CLI 🤓`
            );
            process.exit(1);
          } else {
            Logger.error(
              `🛑 Oops! There is an error logging to Salla. Please try loggin again by running the following command: salla login`
            );
          }
          break;
      }
    });

  setTimeout(() => {
    require("open")(BASE_URL + "/auth/cli?identify=" + randromIdentify);
  }, 2000);
};
