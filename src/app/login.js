const cliSelect = require("cli-select");
const {
  createMessage,
  printMessage,
  printMessages,
} = require("../helpers/message");
const AuthManager = require("../auth/utils/authManager");
const API = require("../auth/utils/api");
const generateRandome = require("../helpers/generateRandom");
const { WebSocket } = require("ws");
const request = require("request");

module.exports = async function (options) {
  let salla_endpoint = "http://127.0.0.1:8080"; //'https://salla.partners/auth/cli';
  let salla_ws_endpoint = "ws://127.0.0.1:3333"; //'ws://salla.partners/auth/cli';
  /*
  - Support a new command line salla login
  - Support setup the auth api key for the salla cli by redirect the partner to salla.partners and ask him the auth and push the token back to the salla cli via  ws
  -   open a browser https://salla.partners/auth/cli
      - https://salla.paretners/login
      - https://salla.partners/auth/cli/compelted → push the api token via ws
  
  */

  const auth = new AuthManager();
  const tokens = auth.getTokens();
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
      console.log("yooo here's the token", data.token);
    }
  });

  printMessage(createMessage(`You are logged to salla`, "succ"));
  printMessage(createMessage(`Error Logging to salla`, "err"));
};
