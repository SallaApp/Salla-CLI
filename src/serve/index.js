const commandExistsSync = require("command-exists").sync;
const { exec } = require("child_process");
const ngrok = require("ngrok");

const Logger = require("../utils/LoggingManager");
const checkFolder = require("../helpers/check-folder");
module.exports = async function (options) {
  // steps to create an app

  // check if ngrok is installed
  if (!commandExistsSync("ngrok")) {
    Logger.info(
      "Installing ngrok library ... please wait! it's one time install ..."
    );

    exec("npm install -g ngrok", (err, stdout, stderr) => {});
  }

  // auto detect the project type
  if (checkFolder() == "express") {
    Logger.info(
      `Starting express project here with PORT:${options.port || 8081} ... `,
      `Starting ngrok connect ...`
    );

    const url = await ngrok.connect();

    Logger.succ(`Remote URL : ${url} `);
    Logger.longLine();
  } else if (checkFolder() == "composer") {
    Logger.info(`Starting laravel project here `);
  } else {
    Logger.error(`This is not a Laravel or Expressjs project! Exiting ...`);
    process.exit(0);
  }
};
