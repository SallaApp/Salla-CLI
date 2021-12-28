const Logger = require("../../utils/LoggingManager");

const env = require("dotenv");
const fs = require("fs-extra");

module.exports = async function (options) {
  try {
    let data = env.parse(fs.readFileSync(".env"));
    Logger.val2("SALLA_APP_ID :", data.SALLA_APP_ID);
    Logger.val2("SALLA_OAUTH_CLIENT_ID :", data.SALLA_OAUTH_CLIENT_ID);
    Logger.val2("SALLA_OAUTH_CLIENT_SECRET :", data.SALLA_OAUTH_CLIENT_SECRET);
    Logger.val2("SALLA_WEBHOOK_SECRET :", data.SALLA_WEBHOOK_SECRET);
    Logger.val2("SALLA_AUTHORIZATION_MODE :", data.SALLA_AUTHORIZATION_MODE);
    Logger.val2(
      "SALLA_OAUTH_CLIENT_REDIRECT_URI :",
      data.SALLA_OAUTH_CLIENT_REDIRECT_URI
    );
  } catch (err) {
    Logger.error(err);
    Logger.warn("Please make sure you type the command in a Salla project");
    Logger.printVisitTroubleshootingPageAndExit();
  }
};
