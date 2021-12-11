const Logger = require("../utils/LoggingManager");
const { ExpressAppCreateor } = require("../stater-kits/express");
const { LaravelAppCreateor } = require("../stater-kits/laravel");

const InputsManager = require("../utils/InputsManager");
const ServeCommand = require("./serve");
const PartnerApi = new (require("../api/partner"))();
const { AuthManager } = require("../utils/AuthManager")();

// export function to Salla-cli
module.exports = async function (options) {
  InputsManager.errorCatch();
  Logger.succ("✨ Getting your apps from Salla ... On the way ☕️");
  const load = Logger.loading("Getting apps ...");

  if (!(await AuthManager.isSallaTokenValid())) {
    Logger.error(
      "🛑 Oops! Unable to authinticate. Try loggin again to Salla by running the following command: salla login"
    );
    process.exit(1);
  }
  let apps = [];
  try {
    apps = await PartnerApi.getAllApps();
  } catch (err) {
    Logger.error(
      "🤔 Hmmm! Something went wrong while fetching your apps from Salla. Please try again later."
    );

    process.exit(1);
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
      "Listed below are the apps assoicated with your Salla Partners account .. You can either select an existing app or create a new app in simple steps"
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
        "🛑 For better visbility, your App Name must be between 10 and 50 characters long!",
      desc: "The app name will be used to create a folder in your project root as well as in your Salla Partners Dashboard, so make sure it's unique, easy to understand, and straight-forward.",
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
        "🛑 To attract merchants, ensure that your description is at least 100 characters long.",
      desc: "This description will be used in the Salla Dashboard to help you attract new merchants. Ensure that your short description is easy-to-understand by the merchants and non-technical personnel as it is the first thing they will see when they visit your app on Salla App Store.",
    });
    // get Email
    options.email = InputsManager.readLine("Email Address:", {
      validate: /\S+@\S+\.\S+/,
      name: "Email",
      desc: "This email will be assoicated with your Salla Partners account. It will also be used to contact you in case of any issues or questions by the Salla Team.",
    });
    // select app type
    options.app_type = await InputsManager.selectInput(
      "Select App Type: (Use arrow keys)",
      PartnerApi.app_types,

      "Salla Partners gives you the option to create your app in three types: Public for all Salla Merchants to download and use, Private for only merchants you choose to download and use. Private for only specific merchants you choose to download and use, and Shipping which are best suitable for shipping companies and delivery services"
    );
    options.app_url = InputsManager.readLine("App Homepage URL:", {
      // TODO : improve it
      validate: (value) => {
        if (value.indexOf("http") > -1) return true;
        return false;
      },
      errorMessage:
        "🛑 Oops! Your App Home Page URL is not in a standard format, HTTP, which could result in merchants not visiting your app's home page website.",

      desc: "Add your app's home page URL where Salla merchants can learn more about your app's services and more.",
    });
    options.auth_mode = await InputsManager.selectInput(
      "App Authorization Mode: (Use arrow keys) ",
      [
        "Easy Mode | In House Authorization",
        "Custom Mode | Custom Callback URL",
      ],
      "With Easy Mode, you will recieve a webhook event when merchants install your app om their stores which contains all the information you need, such as access token, refresh token and more",
      "With Custom Mode, you will be able to set a custom callback URL for merchants to use to authorize your app. "
    );
    if (options.auth_mode.indexOf("Easy") > -1) options.auth_mode = "easy";
    else options.auth_mode = "custom";
  } else {
    // this will trigger process.exit(1) if the app name exists
    InputsManager.checkProjectExists(options.app_path, true);
  }

  // get project type
  const projectType = await InputsManager.selectInput(
    "Select Framework: (Use arrow keys)",
    ["Express", "Laravel"],
    "Select your preferred framework to develope your Salla App."
  );
  if (projectType === "Express") {
    // get database orm
    options.database_orm = await InputsManager.selectInput(
      "App Database ORM: ",
      DATABASE_ORM,
      "Select your prefred ORM to help you create and manage your database for your Salla App."
    );
  }
  let AppData = null;
  if (isNewApp) {
    // we create a new app in salla cloud then we set the args to the new app
    Logger.info("✨ Initializing your app in Salla. On the way ☕️");
    const load_upload_app = Logger.loading("Please Wait ☕️");

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
          "🤔 Hmmm! Something went wrong while creating your app. Please try again by running the following command: salla app create "
        );
        Logger.printVisitTroubleshootingPage();
        process.exit(1);
      }

      Logger.succ("🎉 Hooray! Your app has been created successfully.");
    } catch (err) {
      Logger.error(
        "🤔 Hmmm! Something went wrong while creating your app. Run the following command to create your app: salla app create "
      );
      process.exit(1);
    }
    load_upload_app.stop();
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
    if (projectType === "Express") {
      // Create Express APP
      await ExpressAppCreateor(options);
    } else if (projectType === "Laravel") {
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
    ServeCommand({
      port: DEFAULT_APP_PORT,
    });
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
