const ExecutionManager = require("../../utils/ExecutionManager");
// import deps
const shell = require("shelljs");
const env = require("dotenv");
const Logger = require("../../utils/LoggingManager");
const fs = require("fs");

module.exports.LaravelAppCreateor = async (options) => {
  const executor = new ExecutionManager();
  shell.exec(
    "composer create-project salla/laravel-starter-kit " +
      options.app_name.split(" ").join("_")
  );
  let messages = await executor.run([
    {
      cmd: "create",
      path: `${options.app_path}/.env`,
      content: generateEnv(options),
      msg: "On the way! Creating .env file.",
    },
    {
      cmd: "exec",
      command: "php artisan key:generate",
      path: `${options.app_path}`,
      msg: "On the way! Generating the App Key.",
    },
  ]);
  Logger.printMessages(messages);
};
// If Error occurs while creating the project
process.on("unhandledRejection", function (err) {
  Logger.longLine();
  Logger.normal(err);

  Logger.error(`Hmmm, something went wrong while creating your app. Please try again.`);

  process.exit(0);
});
function generateEnv(args) {
  let envOjb = env.parse(fs.readFileSync(`${__dirname}/.env.example`));
  let outputEnv = "";
  envOjb = {
    ...envOjb,
    SALLA_OAUTH_CLIENT_ID: args.app_client_id,
    SALLA_OAUTH_CLIENT_SECRET: args.app_client_secret,
    SALLA_WEBHOOK_SECRET: args.webhook_secret,
    SALLA_AUTHORIZATION_MODE: args.auth_mode || "easy",
    SALLA_OAUTH_CLIENT_REDIRECT_URI: "",
    SALLA_APP_ID: args.app_id,
  };
  for (let e in envOjb) {
    outputEnv += `${e}=${envOjb[e]}\n`;
  }
  return outputEnv;
}
