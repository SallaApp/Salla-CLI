const ExecutionManager = require("../../utils/ExecutionManager");
// import deps
const env = require("dotenv");
const Logger = require("../../utils/LoggingManager");
const fs = require("fs");
// set constants for the project
const SRC_TEMPLATE = __dirname + "/laravel-starter-kit";
module.exports.LaravelAppCreateor = async (options) => {
  const executor = new ExecutionManager();
  let messages = await executor.run([
    { cmd: "makedir", path: options.app_path, msg: "Making Project Folder" },
    {
      cmd: "copy",
      src: SRC_TEMPLATE,
      dest: `${options.app_path}/`,
      msg: "Setup Laravel files .",
    },

    {
      cmd: "exec",
      command: "npm install",
      path: `${options.app_path}`,
      msg: "Installing Project Deps with NPM",
    },
    {
      cmd: "exec",
      command: "composer install",
      path: `${options.app_path}`,
      msg: "Installing Project Deps with Composer",
    },
    {
      cmd: "create",
      path: `${options.app_path}/.env`,
      content: generateEnv(options),
      msg: "Creating .env file",
    },
    {
      cmd: "exec",
      command: "php artisan key:generate",
      path: `${options.app_path}`,
      msg: "Generating Artisan Key",
    },
  ]);
  Logger.printMessages(messages);
};
// If Error occurs while creating the project
process.on("unhandledRejection", function (err) {
  Logger.longLine();
  Logger.normal(err);

  Logger.error(`Error! while creating your project .`);
  process.exit(0);
});
function generateEnv(args) {
  let envOjb = env.parse(fs.readFileSync(SRC_TEMPLATE + "/.env.example"));
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
