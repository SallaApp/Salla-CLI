const Logger = require("../utils/LoggingManager");

const PartnerApi = new (require("../api/Partner"))();
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

  // get app id from env file
  // update urls of the app
  try {
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

    await askAndDelete(APP.id);
  } catch (err) {
    Logger.error(`🛑 Oops! There is an error in deleting your app .`);

    Logger.printVisitTroubleshootingPage();
  }
  async function askAndDelete(id) {
    let DeleteIt = InputsManager.askYesNo(
      "Are you sure ?",
      " You won't be able to retrive the App once removed as it will disappear from your view as well!"
    );
    if (!DeleteIt) {
      Logger.info("Canceling the deletion!");
      process.exit(1);
    }
    const load_upload_app = Logger.loading("Please Wait ☕️ ...");
    await PartnerApi.deleteApp(id);
    load_upload_app.stop();
    Logger.success("✅ App Deleted Successfully!");
  }
};
