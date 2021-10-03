const THEME_PATH = process.cwd();
const PACKAGE_INFO = require(process.cwd() + "/package.json");
const NODE_ENGINES = "^10 || ^12 || ^14";

const SATARTER_THEME_URL = "http://github.com/SallaApp/theme-y";
const LOGIN_URL = "https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group/themes/new"

module.exports = {
  PACKAGE_INFO,
  THEME_PATH,
  SATARTER_THEME_URL,
  LOGIN_URL,
  NODE_ENGINES
};
