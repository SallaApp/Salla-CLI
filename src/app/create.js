const Logger = require("../utils/LoggingManager");
const { ExpressAppCreateor } = require("../stater-kits/express");
const { LaravelAppCreateor } = require("../stater-kits/laravel");

const InputsManager = require("../utils/InputsManager");
const ServeCommand = require("./serve");
const PartnerApi = new (require("../api/partner"))();
const { AuthManager } = require("../utils/AuthManager")();

// export function to Salla-cli
module.exports = async function (options) {
  Logger.succ("✨ Getting your apps from Salla ... On the way ☕️");
  const load = Logger.loading("Getting apps ...");

  if (!(await AuthManager.isSallaTokenValid())) {
    Logger.error(
      "🛑 Oops! Unable to authinticate. Try loggin again to Salla by running the following command: salla login"
    );
    return;
  }
  let apps = [];
  try {
    apps = await PartnerApi.getAllApps();
  } catch (err) {
    Logger.error(
      "🤔 Hmmm! Something went wrong while fetching your apps from Salla. Please try again later."
    );
    return;
  }
  load.stop();
  //  select app
  options.app_name =
    options.name ||
    (await InputsManager.selectInput(
      "✅ Select Your App:",
      [
        /* apps from developer account */
        ...apps.map((app) => app.name.en),
        "Want to Create New Salla Partner App?",
      ],
      "DESC HERE "
    ));
  let isNewApp = false;
  options.app_path = generateAppPath(options.app_name);
  // check if create new app or not
  if (options.app_name.indexOf("Create New") > -1) {
    console.log("🚀 Creating new app ...");
    isNewApp = true;
    options.app_name = InputsManager.readLine("App Name:", {
      validate(value) {
        if (value.length < 10 || value.length > 50) {
          return false;
        }
        return true;
      },
      name: "App Name",
      errorMessage:
        "ℹ️ For better visbility, your App Name must be between 10 and 50 characters long!",
      desc: "The app name will be used to create a folder in your project root. It will also be used as the app name in the Salla Dashboard.",
    });
    options.app_path = generateAppPath(options.app_name);

    // check if app name is allowed to use
    if (FORBIDDEN_PROJECT_NAMES.includes(options.app_name)) {
      Logger.error(
        `🛑 Oops! Seems like the App Name, ${options.app_name}, is not allowed to use. Please try creating your Salla App with another name.`
      );
      process.exit(1);
    }

    // this will trigger process.exit(1) if the app name exists
    InputsManager.checkProjectExists(options.app_path, true);

    // get description
    options.desc_english = InputsManager.readLine("Short Description:", {
      validate(value) {
        if (value.length < 100) {
          return false;
        }
        return true;
      },

      errorMessage:
        "ℹ️ To attract merchants, ensure that your description is at least 100 characters long.",
      desc: "DESC HERE ",
    });
    // get Email
    options.email = InputsManager.readLine("Email Address:", {
      validate: /\S+@\S+\.\S+/,
      name: "Email ",
    });
    // select app type
    options.app_type = await InputsManager.selectInput(
      "Select App Type: (Use arrow keys)",
      PartnerApi.app_types,

      "DESC HERE "
    );
    options.app_url = InputsManager.readLine("App Homepage URL:", {
      // TODO : improve it
      validate: (value) => {
        if (value.indexOf("http") > -1) return true;
        return false;
      },
      errorMessage: "erorr mesage",

      desc: "DESC HERE ",
    });
    options.auth_mode = await this.selectInput(
      "? App Authorization Mode: (Use arrow keys) ",
      [
        "Easy Mode | In House Authorization",
        "Custom Mode | Custom Callback URL",
      ],
      "DESC HERE "
    );
  } else {
    // this will trigger process.exit(1) if the app name exists
    InputsManager.checkProjectExists(options.app_path, true);
  }

  // get project type
  const projectType = await InputsManager.selectInput(
    "Select Framework: (Use arrow keys)",
    ["Express", "Laravel"],
    "DESC HERE "
  );
  if (projectType === "express") {
    // get database orm
    options.database_orm = await InputsManager.selectInput(
      "App Database ORM: ",
      InputsManager.DATABASE_ORM,
      "DESC HERE "
    );
  }
  let AppData = null;
  if (isNewApp) {
    // we create a new app in salla cloud then we set the args to the new app
    Logger.info("✨ Initializing your app in Salla. On the way ☕️");
    Logger.info("Please Wait ...");
    try {
      AppData = await PartnerApi.addNewApp(
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
      if (AppData == false) {
        Logger.error(
          "🤔 Hmmm! Something went wrong while creating your app. Please try again by running the following command: salla app create  -n <appname>"
        );
        Logger.printVisitTroubleshootingPage();
        process.exit(1);
      }

      Logger.succ("🎉 Hooray! Your app has been created successfully.");
    } catch (err) {
      Logger.error(
        "🤔 Hmmm! Something went wrong while creating your app. Run the following command to create your app: salla app create  -n <appname>"
      );
      process.exit(1);
    }
  }
  if (!AppData) {
    let appData = await PartnerApi.getApp(options.app_name);
    AppData = await PartnerApi.getApp(appData.id);
  } else {
    AppData = AppData.data;
  }

  // get Cliten ID etc
  options.app_client_id = AppData.client_id;
  options.app_client_secret = AppData.client_secret;
  options.webhook_secret = AppData.webhook_secret;
  options.app_id = AppData.id;
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
      Logger.error(
        "🤔 Hmmm! The Framework selected is not supported ... From the provided list, please choose a valid framework."
      );
      process.exit(1);
    }

    process.chdir(options.app_path.split(" ").join("_"));
    // after creating the project we run salla serve
    // run serve
    ServeCommand({ port: DEFAULT_APP_PORT });
  } catch (err) {
    Logger.error(
      "🛑 Oops! There is an error that occured! Please check it.",
      err
    );
    Logger.printVisitTroubleshootingPage();

    process.exit(1);
  }

  // catch Ctrl+C
  InputsManager.catchCtrlC(options.app_name.split(" ").join("_"));

  return;
};

const generateAppPath = (appName) =>
  BASE_PATH + "/" + appName.split(" ").join("_");
