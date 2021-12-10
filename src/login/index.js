const Logger = require("../utils/LoggingManager");

const { AuthManager, SallaAuthApi } = require("../utils/AuthManager")();

const generateRandome = require("../helpers/generateRandom");
const { WebSocket } = require("ws");
const request = require("request");

module.exports = async function (options) {
  // WIP
  let salla_endpoint = "https://salla.partners/auth/cli";
  let salla_ws_endpoint = "ws://salla.partners/auth/cli";

  const tokens = await AuthManager.isSallaTokenValid();

  let rand_idn = generateRandome(64);
  let testEndpoint = `${salla_endpoint}?identify=${rand_idn}`;

  request(testEndpoint, function (error, response, body) {
    console.error("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    console.log("body:", body); // Print the HTML for the Google homepage.
  });
  const ws = new WebSocket(salla_ws_endpoint);

  ws.on("open", function open() {
    setTimeout(() => {
      ws.send(JSON.stringify({ msg: "get-token", identify: rand_idn }));
    }, 3000);
  });

  ws.on("message", function message(data) {
    console.log("received: %s", data);
    data = JSON.parse(data);
    if (data.msg == "ok") {
      console.log("Here is the Token: ", data.token);
    }
  });
  Logger.succ("`👋 Hello World! You have landed successfully at Salla 🤓`");
  Logger.error(`🛑 Oops! There is an error logging to Salla. Please try loggin again by running the following command: salla login`);
};
