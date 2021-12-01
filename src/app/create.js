const Logger = require("../utils/LoggingManager");
const { ExpressAppCreateor } = require("../stater-kits/express");
const generateRandomName = require("../helpers/generateRandom");
const InputsManager = require("../utils/InputsManager");
const ServeCommand = require("./serve");

// export function to Salla-cli
module.exports = async function (options) {
  options.app_name = "SallaAwesomeApp-" + generateRandomName(5);

  //  select app
  const selectedApp = await InputsManager.selectInput("Select App : ", [
    ...[
      /* apps from developer account */
      "aa",
      "bb",
    ],
    "Create New App ?",
  ]);

  // check if create new app or not
  if (selectedApp.indexOf("Create New App") > -1) options.isNewApp = true;
  else options.isNewApp = false;
  options.app_name = selectedApp;
  // check if app name is allowed to use
  if (FORBIDDEN_PROJECT_NAMES.includes(options.app_name)) {
    Logger.error(
      `The App Name that your entered "${options.app_name}" is forbidden please choose another name ! ..  exiting setup .`
    );
    process.exit(1);
  }

  // this will trigger process.exit(1) if the app name exists
  InputsManager.checkProjectExists(`${BASE_PATH}/${options.app_name}`, true);
  // check if the project is new or not
  if (options.isNewApp) {
    // we create a new app in salla cloud then we set the args to the new app
    // if new project we ask for client_id,client_seceret etc ...
    options.app_client_id = InputsManager.getClientIDFromCLI();
    options.app_client_secret = InputsManager.getClientSecretFromCLI();
    options.auth_mode = await InputsManager.getAuthModeFromCLI();
  }
  // get project type
  const projectType = await InputsManager.selectInput("Select Framework : ", [
    "express",
    "laravel",
  ]);
  // get database orm
  options.database_orm = await InputsManager.getDatabaseORMFromCLI();

  Logger.longLine();

  // start creating the project
  // check if the project is expressjs or laravel
  if (projectType === "express") {
    // Create Express APP
    let optionsOutput = await ExpressAppCreateor(options);

    process.chdir(optionsOutput.app_path);
  } else if (projectType === "laravel") {
    // Create Laravel APP
    await require("../stater-kits/laravel");
  } else {
    Logger.error("Framework not supported ... ");
  }

  // after creating the project we run salla serve
  // run serve
  ServeCommand({});

  // catch Ctrl+C
  InputsManager.catchCtrlC(options.app_name);

  return;
};
