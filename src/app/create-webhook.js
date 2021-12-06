const checkFolder = require("../helpers/check-folder");
const Logger = require("../utils/LoggingManager");

module.exports = async function (options) {
  if (checkFolder(process.cwd()) == "express") {
    require("../stater-kits/express/src/main/create-webhook")(options);
    return;
  }

  if (checkFolder(process.cwd()) == "laravel") {
    // here create webhook for laravel
    return;
  }
  Logger.error("Unknow project type. Please use a valid project type.");
};
