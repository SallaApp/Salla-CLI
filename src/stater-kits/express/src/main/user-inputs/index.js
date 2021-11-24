const readlineSync = require("readline-sync");
const DATABASE_ORM = ["Sequelize", "Mongoose", "TypeORM"];
const fs = require("fs");
const { exit } = require("process");
const clc = require("cli-color");

const app_name = process.argv.slice(2)[0];

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
      `[✕] The App Name that your entered "${app_name}" is forbidden please choose another name ! ..  exiting setup .`
    )
  );
  exit(0);
}
if (fs.existsSync(`./${app_name}`)) {
  console.log(
    clc.redBright(
      `[✕] App name "${app_name}" already exists! ..  exiting setup .`
    )
  );
  exit(0);
}

console.log("                    ");
const app_client_id = readlineSync.question("App Client ID: ");
console.log("                    ");
const app_client_secret = readlineSync.question("App Client Secret: ");
console.log("                    ");
const auth_mode = readlineSync.question("Authorization Mode: ");
console.log("                    ");
const webhook_secret = readlineSync.question("App Webhook Secret: ");
console.log("                    ");
const database_orm =
  DATABASE_ORM[readlineSync.keyInSelect(DATABASE_ORM, "App Database ORM: ")];
console.log("                    ");
module.exports = {
  app_name,
  app_client_id,
  app_client_secret,
  auth_mode,
  webhook_secret,
  database_orm,
};
