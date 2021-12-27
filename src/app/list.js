const Logger = require("../utils/LoggingManager");

const { AuthManager } = require("../utils/AuthManager")();

const PartnerApi = new (require("../api/Partner"))();
module.exports = async function (options) {
  Logger.info("✨ Getting your apps from Salla ...");
  const load = Logger.loading("Getting apps ...");

  if (!(await AuthManager.isSallaTokenValid())) {
    Logger.error(
      "🛑 Oops! Unable to authinticate. Try loggin again to Salla by running the following command: salla login"
    );
    Logger.printVisitTroubleshootingPage();
    process.exit(1);
  }
  let apps = [];
  let userInfo = {};
  try {
    apps = await PartnerApi.getAllApps();
    userInfo = AuthManager.getUserInfo();
    if (userInfo == null) userInfo = await PartnerApi.getUserInfo();
  } catch (err) {
    Logger.error(
      "🤔 Hmmm! Something went wrong while fetching your apps from Salla. Please try again later."
    );
    Logger.printVisitTroubleshootingPage();
    process.exit(1);
  }

  let appsArray = apps.map((a) => {
    return [[a.id], [a.name.en], [a.type], [a.status]];
  });

  Logger.PrintTable(["ID", "Name", "Type", "Status"], appsArray);

  load.stop();
};
