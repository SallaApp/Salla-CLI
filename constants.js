const fs = require("fs-extra");
global.BASE_PATH = process.cwd();
global.NODE_ENGINES = "^10 || ^12 || ^14 || ^16";
global.NPM_ENGINES = "^6 || ^7 || ^8";
global.CLI_CONFIG_DIR = require("os").homedir() + "/.salla";
global.CLI_CONFIG_FILE = require("path").join(CLI_CONFIG_DIR, "config.json");
global.BASE_URL = "";
const Logger = require("./src/utils/LoggingManager");
// get the config file
try {
  let config_file = require(CLI_CONFIG_FILE);
  global.BASE_URL = config_file.BASE_URL;

  if (typeof config_file.salla == "undefined")
    Logger.showHeadWithWelcomeMessage(true);
  else if (!config_file.salla.access_token)
    Logger.showHeadWithWelcomeMessage(true);
} catch (e) {
  Logger.showHeadWithWelcomeMessage(true);
  //create config file with dir
  fs.mkdirSync(require("os").homedir() + "/.salla");
  fs.writeJSONSync(CLI_CONFIG_FILE, {
    BASE_URL: "https://partners-7148f85b25810aa8a1967a7b6f5c0117.salla.group",
    salla: {},
    github: {},
  });
}
global.BASE_URL =
  BASE_URL || "https://partners-7148f85b25810aa8a1967a7b6f5c0117.salla.group";

// theme constants
global.AUTH_URL = BASE_URL + "/accounts/oauth/cli";
global.ASSETS_PORT = "8181";
global.BASE_THEME = {
  url: "https://github.com/SallaApp/theme-one",
  org: "SallaApp",
  repo: "theme-one",
};
global.AUTHENTICATION_PORT = "9898";

// express create project constants
global.FORBIDDEN_PROJECT_NAMES = ["node_modules", "src", "public"];
global.DATABASE_ORM = ["Sequelize", "Mongoose", "TypeORM"];
global.DEFAULT_APP_PORT = 8081;
// load strings file
/**

try {
  global.STRINGS = require("./strings.json");
} catch (e) {
  console.log("ERROR READING STRINGS FILE", e);
  process.exit(1);
}

 */
