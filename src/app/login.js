const cliSelect = require("cli-select");

const AuthManager = require("../auth/utils/authManager");
const API = require("../auth/utils/api");
// export function to Salla-cli
module.exports = async function (options) {
  /*
  - Support a new command line salla login
  - Support setup the auth api key for the salla cli by redirect the partner to salla.partners and ask him the auth and push the token back to the salla cli via  ws
  -   open a browser https://salla.partners/auth/cli
      - https://salla.paretners/login
      - https://salla.partners/auth/cli/compelted → push the api token via ws
  
  */
  const api = new API();
  const auth = new AuthManager();
  const tokens = auth.getTokens();
  console.log("login to salla app", tokens);

  let selectedApp = await cliSelect({
    values: api.getApps().map((a) => a.name.en),
  });
  selectedApp = selectedApp.value;
  const appJSON = api.getApps().filter((a) => a.name.en === selectedApp)[0];
  const SelectedAppJSON = api.selectedApp();
  console.log("app", appJSON);
  auth.saveToken("client_id", SelectedAppJSON.client_id);
  auth.saveToken("client_secret", SelectedAppJSON.client_secret);
  auth.saveToken("redirect_urls", SelectedAppJSON.redirect_urls);
  auth.saveToken("webhook_secret", SelectedAppJSON.webhook_secret);
  auth.saveToken("webhook_url", SelectedAppJSON.webhook_url);
};
