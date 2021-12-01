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
      console.log("here's the token", data.token);
    }
  });
  Logger.succ("`You are Logged to salla");
  Logger.error(`Error Logging to salla`);
};
