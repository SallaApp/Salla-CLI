const cliSelect = require("cli-select");
const chalk = require("chalk");

// export function to Salla-cli
module.exports = function (options) {
  // steps to create an app
  /*
    list all applications 
    or create new api
    and get all the ids from the api 
 

  - Support Create an app using salla cli salla app create {name --optional}
    - Ask the api token from the user if not present in the cli
      - run the salla login
    - Get the list of apps or create a new one
      - Create an app will be simple just ask the name, desc, the home page and email
    -   The developer will select the type of app (Laravel, Express (Soon))
    - Setup the env file with the app settings (client id, secret, auth mode)
    - Update the webhook url & callback url base in the project settings base in the expose details with every serve command


  - Support a new command line salla login
  - Support setup the auth api key for the salla cli by redirect the partner to salla.partners and ask him the auth and push the token back to the salla cli via  ws
  -   open a browser https://salla.partners/auth/cli
      - https://salla.paretners/login
      - https://salla.partners/auth/cli/compelted → push the api token via ws

  
  */

  cliSelect({
    values: ["express", "laravel"],
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.underline(value);
      }

      return value;
    },
  }).then((type) => {
    type = type.value;
    if (type === "express") {
      require("../stater-kits/express").expressAppCreateor({
        type,
        ...options,
      });
    } else if (type === "laravel") {
      require("../stater-kits/laravel");
    } else {
      console.log("Invalid app type!! , please enter -t (express or laravel)");
    }
  });
  return;
};
