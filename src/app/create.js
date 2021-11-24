const API = require("../auth/utils/api");
const InputSelector = require("../helpers/cli-selector");
// export function to Salla-cli
module.exports = async function (options) {
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
  */
  const api = new API();

  const type = (
    await InputSelector("Select Framework : ", ["express", "laravel"])
  ).value;
  const mode = (await InputSelector("Select Mode : ", ["easy", "custom"]))
    .value;
  const app = (
    await InputSelector("Select App : ", [
      ...api.getApps().map((a) => a.name.en),
      "Create New App ?",
    ])
  ).value;

  if (type === "express") {
    if (mode === "easy") {
      require("../stater-kits/express").expressAppCreateor({
        type,
        mode,
        ...options,
        app_name: app,
      });
    } else {
      require("../stater-kits/express").expressAppCreateor({
        type,
        mode,
        ...options,
        app_name: app,
      });
    }
  } else if (type === "laravel") {
    require("../stater-kits/laravel");
  } else {
    console.log("Invalid app type!! , please enter -t (express or laravel)");
  }

  return;
};
