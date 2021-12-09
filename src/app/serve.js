const commandExistsSync = require("command-exists").sync;
const { execSync, exec } = require("child_process");
const ngrok = require("ngrok");

const Logger = require("../utils/LoggingManager");
const checkFolder = require("../helpers/check-folder");
const fs = require("fs-extra");
const env = require("dotenv");
const PartnerApi = new (require("../api/partner"))();
module.exports = async function (options) {
  options.port = options.port || DEFAULT_APP_PORT;
  // check if ngrok is installed
  if (!commandExistsSync("ngrok")) {
    Logger.info(
      "✅ Installing ngrok library as a one-time installation..."
    );

    execSync("npm install -g ngrok");
  }
  Logger.info(
    `✅ Starting your project on PORT:${options.port} ... `,
    `✅ Starting ngrok ngrok ... `
  );
  const url = await ngrok.connect({
    addr: options.port,
  });
  Logger.longLine();
  Logger.succ(`Remote URL : ${url} `);
  Logger.succ(`Local  URL : http://localhost:${options.port} `);
  Logger.succ(`Webhook URL : ${url}/webhook/ `);
  Logger.succ(`OAuth Callback URL : ${url}/oauth/callback/ `);

  Logger.longLine();
  // give sometime to ngrok to connect and expressjs to start
  setTimeout(() => {
    require("open")(url);
  }, 1000);

  // get app id from env file
  // update urls of the app
  try {
    let data = env.parse(fs.readFileSync(".env"));

    try {
      await PartnerApi.updateWebhookURL(data.SALLA_APP_ID, `${url}/webhook/`);
    } catch (e) {}
    try {
      await PartnerApi.updateRedirectURL(
        data.SALLA_APP_ID,
        `${url}/oauth/callback/`
      );
    } catch (e) {}
    Logger.succ(
      `🎉 Hooray! OAuth Callback and Webhook URLs have been updated successfully.`
    );
    Logger.longLine();
    Logger.normal("As always, happy coding!");
    Logger.longLine();
    fs.writeFileSync(".env", generateEnv(data, `${url}/oauth/callback`));
  } catch (err) {
    Logger.error(`🛑 Oops! There is an error in reading .env file. Please check it.`);
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
          Logger.error(`Can't Start Laravel app ...`, err.message);
          return;
        }
        Logger.normal(stdout);
        Logger.normal(stderr);
        Logger.succ(
          `🎉 Hooray! Laravel App Started Successfully on PORT:${options.port}`
        );
      }
    );
  } else {
    Logger.error(
      `🤔 Hmmm, this is not a Laravel or Expressjs project! The project will be exited.`
    );
    process.exit(1);
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
