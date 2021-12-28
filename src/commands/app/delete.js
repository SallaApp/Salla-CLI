const Logger = require("../../utils/LoggingManager");

const PartnerApi = new (require("../../api/Partner"))();
const InputsManager = require("../../utils/InputsManager");
const { AuthManager } = require("../../utils/AuthManager")();

module.exports = async function (options) {
  Logger.longLine();

  // check and exit if access token not vaild
  await AuthManager.isSallaTokenValid();

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

      Logger.printVisitTroubleshootingPageAndExit();
    }

    let DeleteIt = InputsManager.askYesNo(
      "Are you sure ?",
      " You won't be able to retrive the App once removed as it will disappear from your view as well!"
    );
    if (!DeleteIt) {
      Logger.info("Canceling the deletion!");
      Logger.printVisitTroubleshootingPageAndExit();
    }
    const load_upload_app = Logger.loading("Please Wait ☕️ ...");
    await PartnerApi.deleteApp(APP.id);
    load_upload_app.stop();
    Logger.success("✅ App Deleted Successfully!");
  } catch (err) {
    Logger.error(`🛑 Oops! There is an error in deleting your app .`);

    Logger.printVisitTroubleshootingPageAndExit();
  }
};
