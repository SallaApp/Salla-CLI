const cliSelect = require("cli-select");
const {
  createMessage,
  printMessage,
  printMessages,
} = require("../helpers/message");
const AuthManager = require("../auth/utils/authManager");
const API = require("../auth/utils/api");
const generateRandome = require("../helpers/generateRandom");
module.exports = async function (options) {
  /*
  - Support a new command line salla login
  - Support setup the auth api key for the salla cli by redirect the partner to salla.partners and ask him the auth and push the token back to the salla cli via  ws
  -   open a browser https://salla.partners/auth/cli
      - https://salla.paretners/login
      - https://salla.partners/auth/cli/compelted → push the api token via ws
  
  */

  const auth = new AuthManager();
  const tokens = auth.getTokens();
  console.log(
    `https://salla.partners/auth/cli?identify=${generateRandome(64)}`
  );
  printMessage(createMessage(`You are logged to salla`, "succ"));
  printMessage(createMessage(`Error Logging to salla`, "err"));
};
