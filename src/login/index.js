const Logger = require("../utils/LoggingManager");
const { SallaAuthAPI } = require("../utils/AuthManager")();
const generateRandom = require("../helpers/generateRandom");
const SallaWS = require("@salla.sa/websocket");

module.exports = async function (options) {
  //const isVaild = await AuthManager.isSallaTokenValid();
  // if (isVaild) {
  //  Logger.succ("`👋 Hello World! You have landed successfully at Salla 🤓`");
  //   return;
  // }
  let randromIdentify = generateRandom(64);
  let generateConnectionTokenEndpoint =
    await SallaAuthAPI.generateConnectionTokenEndpoint(randromIdentify);

  SallaWS.websocket
    .init({
      connectionEndpoint: WS_ENDPOINT,
      connectionToken: generateConnectionTokenEndpoint,
    })
    .connect()
    .subscribe("salla:cli#" + randromIdentify, function (event) {
      const data = event.data;
      console.log("data", data);

      // store the token in the auth file
    });

  Logger.succ("`👋 Hello World! You have landed successfully at Salla 🤓`");
  Logger.error(
    `🛑 Oops! There is an error logging to Salla. Please try loggin again by running the following command: salla login`
  );
};
