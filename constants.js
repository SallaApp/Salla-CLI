const fs = require("fs-extra");
global.BASE_PATH = process.cwd();
global.NODE_ENGINES = "^10 || ^12 || ^14";
global.CLI_CONFIG_DIR = require("os").homedir() + "/.salla";
global.CLI_CONFIG_FILE = require("path").join(CLI_CONFIG_DIR, "config.json");
global.BASE_URL = "";
try {
  global.BASE_URL = require(CLI_CONFIG_FILE).BASE_URL;
} catch (e) {
  //create config file with dir
  fs.mkdirSync(require("os").homedir() + "/.salla");
  fs.writeJSONSync(CLI_CONFIG_FILE, { BASE_URL: "" });
}
global.BASE_URL =
  BASE_URL || "https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group";

global.BASE_THEME = {
  url: "https://github.com/SallaApp/theme-one",
  org: "SallaApp",
  repo: "theme-one",
};

global.AUTH_URL = BASE_URL + "/accounts/oauth/cli";
global.ASSETS_PORT = "8181";
global.AUTHENTICATION_PORT = "9898";
