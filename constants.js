/** @global */
global.BASE_PATH = process.cwd();
/** @global */
global.NODE_ENGINES = "^10 || ^12 || ^14";
/** @global */
global.BASE_URL = 'https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group';//"https://s.salla.test";//"https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group";

/** @global */
global.BASE_THEME = {
    url : "https://github.com/SallaApp/theme-y",
    org : "SallaApp",
    repo: "theme-y"
};

/** @global */
global.AUTH_URL = BASE_URL + "/accounts/oauth/cli";
/** @global */
global.FORCE_RE_AUTH_URL = AUTH_URL + "?force=1";
/** @global */
global.ASSETS_PORT = "8181";
/** @global */
global.AUTHENTICATION_PORT = "9898"
