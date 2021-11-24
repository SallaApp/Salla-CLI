const readlineSync = require("readline-sync");
const DATABASE_ORM = ["Sequelize", "Mongoose", "TypeORM"];
const fs = require("fs");
const { exit } = require("process");
const clc = require("cli-color");
const generateRandomName = require("../../helpers/generateRandom");
const getInput = require("../../helpers/getInput");
module.exports.inputs = (options) => {
  const app_name = options.name || "SallaAwesomeApp-" + generateRandomName(5);

  if (!app_name) {
    console.log(
      clc.blueBright(`  [!] Useing : npm run create-project YOUR_APP_NAME `)
    );
    exit(0);
  }
  const forbidden_project_names = ["node_modules", "src", "public"];
  if (forbidden_project_names.includes(app_name)) {
    console.log(
      clc.redBright(
        `[x] The App Name that your entered "${app_name}" is forbidden please choose another name ! ..  exiting setup .`
      )
    );
    exit(0);
  }
  if (fs.existsSync(`${options.HOME_DIR_PROJECTS}/${app_name}`)) {
    console.log(
      clc.redBright(
        `[x] App name "${options.HOME_DIR_PROJECTS}${app_name}" already exists! ..  exiting setup .`
      )
    );
    exit(0);
  }
  let app_client_id = "";
  let app_client_secret = "";
  let webhook_secret = "";

  if (options.mode !== "easy") {
    app_client_id = getInput("App Client ID: ");
    app_client_secret = getInput("App Client Secret: ");
    webhook_secret = getInput("App Webhook Secret: ");
  } else {
    app_client_id = options.app_client_id || "";
    app_client_secret = options.app_client_secret || "";
    webhook_secret = options.webhook_secret || "";
  }

  const database_orm =
    DATABASE_ORM[readlineSync.keyInSelect(DATABASE_ORM, "App Database ORM: ")];
  console.log("                    ");
  return {
    app_name,
    app_client_id,
    app_client_secret,
    auth_mode: options.mode,
    webhook_secret,
    database_orm,
  };
};
