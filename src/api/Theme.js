const SallaApi = require("./SallaApi");

module.exports = class ThemeAPI extends SallaApi {
  constructor(args) {
    super(args);
  }
  setThemeAccessToken(theme_access_token) {
    this.theme_access_token = theme_access_token;
  }
  publishTheme(draft_id) {
    return this.request(
      "publish",
      {
        params: [draft_id],
      },
      null,
      this.theme_access_token
    );
  }
  upload_file(fromData) {
    return this.request(
      "upload_file",
      fromData,
      fromData.getHeaders(),
      this.theme_access_token
    );
  }
  new_draft({ repo_url, name, theme_id }) {
    return this.request(
      "new_draft",
      {
        repo_url: repo_url,
        name: name,
        theme_id: theme_id,
      },
      null,
      this.theme_access_token
    );
  }
};
