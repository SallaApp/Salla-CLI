const Logger = require("../utils/LoggingManager");
const { ExpressAppCreateor } = require("../stater-kits/express");
const { LaravelAppCreateor } = require("../stater-kits/laravel");
const generateRandomName = require("../helpers/generateRandom");
const InputsManager = require("../utils/InputsManager");
const ServeCommand = require("./serve");
const PartnerApi = new (require("../api/partner"))();
const { AuthManager } = require("../utils/AuthManager")();

// export function to Salla-cli
module.exports = async function (options) {
  Logger.info("Please wait while we are getting your apps from Salla ... It won't take much time . ");
  // Logger.info("Getting your apps from Salla! Hold on until fully fetched ...");
  if (!(await AuthManager.isSallaTokenValid())) {
    Logger.error("Please, login to Salla!");
    return;
  }
  let apps = [];
  try {
    apps = await PartnerApi.getAllApps();
  } catch (err) {
    Logger.error("Hmmmm, something went wrong while fetching your apps from Salla. Please try again later.");
    return;
  }

  //  select app
  options.app_name =
    options.name ||
    (await InputsManager.selectInput("Select App : ", [
      /* apps from developer account */
      ...apps.map((app) => app.name.en),
      "Create New App ?",
    ]));
  let isNewApp = false;
  options.app_path = generateAppPath(options.app_name);
  // check if create new app or not
  if (options.app_name.indexOf("Create New App") > -1) {
    isNewApp = true;
    options.app_name = InputsManager.readLine("Enter App Name : ", {
      validate(value) {
        if (value.length < 10 || value.length > 50) {
          return false;
        }
        return true;
      },
      name: "App Name",
      errorMessage: "Your App Name must be between 10 and 50 characters long",
    });
    options.app_path = generateAppPath(options.app_name);

    // check if app name is allowed to use
    if (FORBIDDEN_PROJECT_NAMES.includes(options.app_name)) {
      Logger.error(
        `The App Name ${options.app_name} is not allowed to use. Please try with another name.`
      );
      process.exit(1);
    }

    // this will trigger process.exit(1) if the app name exists
    InputsManager.checkProjectExists(options.app_path, true);

    // get description
    options.desc_english = InputsManager.readLine("Enter Description  : ", {
      validate(value) {
        if (value.length < 100) {
          return false;
        }
        return true;
      },

      errorMessage: "Description must be at least 100 characters long",
    });
    // get Email
    options.email = InputsManager.readLine("Enter Email : ", {
      validate: /\S+@\S+\.\S+/,
      name: "Email ",
    });
    // select app type
    options.app_type = await InputsManager.selectInput(
      "Select App Type : ",
      PartnerApi.app_types
    );
    options.app_url = InputsManager.readLine("Enter URL : ");
    options.auth_mode = await InputsManager.getAuthModeFromCLI();
  } else {
    // this will trigger process.exit(1) if the app name exists
    InputsManager.checkProjectExists(options.app_path, true);
  }

  // get project type
  const projectType = await InputsManager.selectInput("Select Framework : ", [
    "express",
    "laravel",
  ]);
  if (projectType === "express") {
    // get database orm
    options.database_orm = await InputsManager.getDatabaseORMFromCLI();
  }

  if (isNewApp) {
    // we create a new app in salla cloud then we set the args to the new app
    Logger.info("Initializing your app in Salla. This might take a while ...");
    Logger.info("Please Wait ...");
    try {
      let res = await PartnerApi.addNewApp(
        {
          name_ar: options.app_name,
        },
        {
          short_description_ar: options.desc_english,
        },
        options.email,
        options.app_type,
        options.app_url
      );
      if (res == false) {
        Logger.error("Hmmmm, something went wrong while creating your app. Please try again later.");
        process.exit(1);
      }

      Logger.succ("Whoop! Your app has been created successfully.");
    } catch (err) {
      Logger.error(
        "Hmmmm, something went wrong while creating your app. Please try again later."
      );
      //process.exit(1);
    }
  }
  let appData = await PartnerApi.getApp(options.app_name);
  appData = await PartnerApi.getApp(appData.id);

  // get Cliten ID etc
  options.app_client_id = appData.client_id;
  options.app_client_secret = appData.client_secret;
  options.webhook_secret = appData.webhook_secret;
  options.app_id = appData.id;
  // update webhooks and redirect urls IN serve

  Logger.longLine();

  // start creating the project
  // check if the project is expressjs or laravel
  try {
    if (projectType === "express") {
      // Create Express APP
      await ExpressAppCreateor(options);
    } else if (projectType === "laravel") {
      // Create Laravel APP
      await LaravelAppCreateor(options);
    } else {
      Logger.error("The Framework selected is not supported ... Please choose a valid framework");
      process.exit(1);
    }

    process.chdir(options.app_path.split(" ").join("_"));
    // after creating the project we run salla serve
    // run serve
    ServeCommand({ port: DEFAULT_APP_PORT });
  } catch (err) {
    Logger.error("Error ... ", err);
    process.exit(1);
  }

  // catch Ctrl+C
  InputsManager.catchCtrlC(options.app_name.split(" ").join("_"));

  return;
};

const generateAppPath = (appName) =>
  BASE_PATH + "/" + appName.split(" ").join("_");