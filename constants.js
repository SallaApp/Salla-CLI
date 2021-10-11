const THEME_PATH = process.cwd();
const NODE_ENGINES = "^10 || ^12 || ^14";

const SATARTER_THEME_INFO = {
  url: "https://github.com/tahaabdoh/jamalY",
  owner: "tahaabdoh",
  repo: "jamalY"
};


const LOGIN_URL = "https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group/accounts/oauth/cli"
const DRAFT_THEME_ENDPOINT = "https://dashboard-26c3cd35add3468fc189c714bd1a1345.salla.group/admin/v2/theme"

module.exports = {
  THEME_PATH,
  SATARTER_THEME_INFO,
  LOGIN_URL,
  NODE_ENGINES,
  DRAFT_THEME_ENDPOINT
};