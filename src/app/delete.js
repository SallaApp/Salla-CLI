const Logger = require("../utils/LoggingManager");

const fs = require("fs-extra");
const env = require("dotenv");
const PartnerApi = new (require("../api/partner"))();
const InputsManager = require("../utils/InputsManager");
const { AuthManager } = require("../utils/AuthManager")();

module.exports = async function (options) {
  Logger.longLine();
  if (!(await AuthManager.isSallaTokenValid())) {
    Logger.error(
      "🛑 Oops! Unable to authinticate. Try loggin again to Salla by running the following command: salla login"
    );
    process.exit(1);
  }
  const load_upload_app = Logger.loading("Please Wait ☕️ ...");

  // get app id from env file
  // update urls of the app
  try {
    if (options.id) {
      await PartnerApi.deleteApp(options.id);
      Logger.success("✅ App Deleted Successfully!");
      load_upload_app.stop();
      return;
    }
    if (fs.existsSync(".env")) {
      let data = env.parse(fs.readFileSync(".env"));

      await PartnerApi.deleteApp(data.SALLA_APP_ID);

      Logger.succ("App Deleted Successfully");
      load_upload_app.stop();
    } else {
      Logger.warn("SALLA_APP_ID in .env file not found!");
      load_upload_app.stop();
      let APP = await InputsManager.getAppIDFromApps(
        "✅ Select App to Delete :",
        "Listed below are the apps assoicated with your Salla Partners account ..\nYou can select an existing app to be deleted ",
        await PartnerApi.getAllApps()
      );
      if (APP == null) {
        Logger.error(
          "🤔 Hmmm! Something went wrong while fetching your apps from Salla. Please try again later."
        );

        process.exit(1);
      }
      let SALLA_APP_ID = APP.id;

      await PartnerApi.deleteApp(SALLA_APP_ID);
    }

    Logger.success("✅ App Deleted Successfully!");
  } catch (err) {
    Logger.error(`🛑 Oops! There is an error in deleting your app .`);
    load_upload_app.stop();
    Logger.printVisitTroubleshootingPage();
  }
};
