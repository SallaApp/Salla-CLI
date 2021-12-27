const Logger = require("../utils/LoggingManager");

const fs = require("fs-extra");
const env = require("dotenv");
const PartnerApi = new (require("../api/Partner"))();
const InputsManager = require("../utils/InputsManager");
const { AuthManager } = require("../utils/AuthManager")();

module.exports = async function (options) {
  try {
    let data = env.parse(fs.readFileSync(".env"));
    if (
      !data.SALLA_APP_ID ||
      !(await PartnerApi.isAppExist(data.SALLA_APP_ID))
    ) {
      Logger.error("SALLA_APP_ID in .env file not found!");
      process.exit(1);
    }
    Logger.succ("Redrcting you to Salla Publish Page...");
    require("open")(PartnerApi.getAppUrl(data.SALLA_APP_ID));
  } catch (err) {
    Logger.error(
      `🛑 Oops! There is an error in writing .env file. Ensure that you have root/admin access on your end. Due to that, the system is terminating the process with code 1. Please try again.`
    );
    process.exit(1);
  }
};
