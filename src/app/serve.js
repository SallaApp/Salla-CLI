const commandExistsSync = require("command-exists").sync;
const { execSync, exec } = require("child_process");
const ngrok = require("ngrok");

const Logger = require("../utils/LoggingManager");
const checkFolder = require("../helpers/check-folder");
const fs = require("fs-extra");
const env = require("dotenv");
const PartnerApi = new (require("../api/partner"))();
const InputsManager = require("../utils/InputsManager");
const { AuthManager } = require("../utils/AuthManager")();

module.exports = async function (options) {
  if (!(await AuthManager.isSallaTokenValid())) {
    Logger.error(
      "🛑 Oops! Unable to authinticate. Try loggin again to Salla by running the following command: salla login"
    );
    process.exit(1);
  }
  options.port = options.port || DEFAULT_APP_PORT;
  // check if ngrok is installed
  if (!commandExistsSync("ngrok")) {
    Logger.info("✨ Installing ngrok library as a one-time installation...");

    execSync("npm install -g ngrok");
  }
  if (checkFolder() != "express" && checkFolder() != "laravel") {
    Logger.error(
      `🤔 Hmmm! This is neither a Laravel nor an Expressjs project! Please try again.`
    );
    process.exit(1);
  }
  Logger.info(`✨ Starting your project on PORT:${options.port} ... `);
  Logger.longLine();

  // get app id from env file
  // update urls of the app
  try {
    let data = env.parse(fs.readFileSync(".env"));
    if (
      !data.SALLA_APP_ID ||
      !(await PartnerApi.isAppExist(data.SALLA_APP_ID))
    ) {
      Logger.warn("SALLA_APP_ID in .env file not found!");

      let APP = await InputsManager.getAppIDFromApps(
        "✅ Select an app to link it to your project folder :",
        "Listed below are the apps assoicated with your Salla Partners account ..\nYou can select an existing app to link it to your project folder ",
        await PartnerApi.getAllApps()
      );

      if (APP == null) {
        Logger.error(
          "🤔 Hmmm! Something went wrong while fetching your apps from Salla. Please try again later."
        );

        process.exit(1);
      }
      data.SALLA_APP_ID = APP.id;
    }

    //check if serve is local or with ngrok setup
    if (!options.local) {
      Logger.info(`✨ Starting ngrok. Please hold on ... `);
      Logger.longLine();
      const load_upload_app = Logger.loading("Please Wait ☕️ ...");

      const url = await ngrok.connect({
        addr: options.port,
        authtoken:
          process.env.NGROK_TOKEN ||
          "228l6GcFdMoGrXzSia73IFbvZ3f_7VMZvSvSnG4g2FvN3yP4q",
      });

      Logger.longLine(2);
      Logger.succ(`Remote URL : ${url} `);
      Logger.succ(`Local  URL : http://localhost:${options.port} `);
      Logger.succ(`Webhook URL : ${url}/webhook/ `);
      Logger.succ(`OAuth Callback URL : ${url}/oauth/callback/ `);
      load_upload_app.stop();

      Logger.longLine();
      // give sometime to ngrok to connect and expressjs to start
      setTimeout(() => {
        require("open")(url);
      }, 3000);

      try {
        await PartnerApi.updateWebhookURL(data.SALLA_APP_ID, `${url}/webhook/`);
      } catch (e) {
        Logger.error(
          "🤔 Hmmm! Something went wrong while updating webhook URL! Please try again later."
        );

        process.exit(1);
      }
      try {
        await PartnerApi.updateRedirectURL(
          data.SALLA_APP_ID,
          `${url}/oauth/callback/`
        );
      } catch (e) {
        Logger.error(
          "🤔 Hmmm! Something went wrong while updating Redirect URL! Please try again later."
        );

        process.exit(1);
      }
      Logger.succ(
        `🎉 Hooray! OAuth Callback and Webhook URLs have been updated successfully.`
      );
      Logger.longLine();
      Logger.normal("💻 As always, Happy Coding! 💻");
      Logger.longLine();
      fs.writeFileSync(".env", generateEnv(data, `${url}/oauth/callback`));
    } else {
      Logger.succ(`Local  URL : http://localhost:${options.port} `);
      Logger.succ(
        `OAuth Callback URL : http://localhost:${options.port}/oauth/callback/ `
      );
      setTimeout(() => {
        require("open")(`http://localhost:${options.port}`);
      }, 1000);
    }
  } catch (err) {
    Logger.error(
      `🛑 Oops! There is an error in writing .env file. Ensure that you have root/admin access on your end. Due to that, the system is terminating the process with code 1. Please try again.`
    );
  }

  // auto detect the project type
  if (checkFolder() == "express") {
    exec(
      "npm run start-app -p " + options.port,
      { cwd: process.cwd() },
      (err, stdout, stderr) => {
        if (err) {
          Logger.error(
            `🤔 Hmmm! Expressjs app couldn't be started.`,
            err.message
          );
          return;
        }
        Logger.normal(stdout);
        Logger.normal(stderr);
        Logger.succ(
          `🎉 Hooray! ExpressJS App Started Successfully on PORT:${options.port} `
        );
      }
    );
  } else if (checkFolder() == "laravel") {
    exec(
      "php artisan serve --port " + options.port,
      { cwd: process.cwd() },
      (err, stdout, stderr) => {
        if (err) {
          Logger.error(
            `🤔 Hmmm! Laravel app coudln't be started ...`,
            err.message
          );
          return;
        }
        Logger.normal(stdout);
        Logger.normal(stderr);
        Logger.succ(
          `🎉 Hooray! Laravel App Started Successfully on PORT:${options.port}`
        );
      }
    );
  }

  function generateEnv(envOjb, SALLA_OAUTH_CLIENT_REDIRECT_URI) {
    let outputEnv = "";
    envOjb = {
      ...envOjb,
      SALLA_OAUTH_CLIENT_REDIRECT_URI,
    };
    for (let e in envOjb) {
      outputEnv += `${e}=${envOjb[e]}\n`;
    }
    return outputEnv;
  }
};
