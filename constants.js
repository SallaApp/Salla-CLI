/**
 * @typedef  {{
 *                  DRAFT_THEME_ENDPOINT    : string,
 *                  AUTH_URL                : string,
 *                  FORCE_RE_AUTH_URL       : string,
 *                  THEME_PATH              : string,
 *                  BASE_THEME              : {org: string, repo: string, url: string},
 *                  NODE_ENGINES            : string
 *              }} ThemeConstants
 */
const THEME_PATH = process.cwd();
const NODE_ENGINES = "^10 || ^12 || ^14";
const BASE_URL = "https://s.salla.test";//"https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group";

const BASE_THEME = {
    url : "https://github.com/SallaApp/theme-y",
    org : "SallaApp",
    repo: "theme-y"
};


const AUTH_URL = BASE_URL + "/accounts/oauth/cli";
const FORCE_RE_AUTH_URL = AUTH_URL + "?force=1";
const DRAFT_THEME_ENDPOINT = BASE_URL + "/admin/v2/theme"; //TODO:: Move to salla api

module.exports = {
    THEME_PATH,
    BASE_THEME,
    AUTH_URL,
    FORCE_RE_AUTH_URL,
    NODE_ENGINES,
    DRAFT_THEME_ENDPOINT
};