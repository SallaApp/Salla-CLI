const Logger = require("../utils/LoggingManager");

const fs = require("fs-extra");
const env = require("dotenv");
const PartnerApi = new (require("../api/partner"))();
module.exports = async function (options) {
  Logger.longLine();

  const load_upload_app = Logger.loading("Please Wait ☕️ ...");

  // get app id from env file
  // update urls of the app
  try {
    let data = env.parse(fs.readFileSync(".env"));
    await PartnerApi.deleteApp(options.id || data.SALLA_APP_ID);
    Logger.succ("App Deleted Successfully");
    load_upload_app.stop();
  } catch (err) {
    Logger.error(`🛑 Oops! There is an error in deleting your app .`);
    load_upload_app.stop();
    Logger.printVisitTroubleshootingPage();
  }
};
