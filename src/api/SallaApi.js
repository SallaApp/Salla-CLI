const axios = require("axios");
const Logger = require("../utils/LoggingManager");
const { AuthManager } = require("../utils/AuthManager")();
/**
 * @typedef {string} accessToken
 * @typedef {string} baseEndpoint
 */
module.exports = class SallaAPI {
  constructor() {
    this.baseEndpoint = BASE_URL + "/api/";
    this.baseEndpointTheme = THEME_END_POINT + "/admin/v2/";
    (async () => {
      this.accessToken = (await AuthManager.getTokens()).salla.access_token;
      this.themeAccessToken = (
        await AuthManager.getTokens()
      ).salla.theme_access_token;
    })();
    this.endpoints = {
      user: "oauth2/user/info",
      // theme endpoints
      new_draft: "theme",
      upload_file: "theme/{draft_id}/upload",
      publish: "theme/{draft_id}/publish",
      // partner endpoints
      apps: "app",
      me: "me",
      add: "app",
    };

    //by default all methods are post, so if there is need to another method, set it here
    this.endpointsMethods = {
      user: "get",
      apps: "get",
      me: "get",
      add: "post",
    };
  }

  setAccessToken(accessToken) {
    AuthManager.set("salla", { access_token: accessToken });
    this.accessToken = accessToken;
  }
  setThemeAccessToken(themeAccessToken) {
    AuthManager.set("salla", { theme_access_token: themeAccessToken });
    this.themeAccessToken = themeAccessToken;
  }
  request(endpoint, data, headers, accessToken) {
    if (!this.endpoints[endpoint]) {
      throw "🛑 Oops! The system failed to find endpoint for: " + endpoint;
    }
    let url = this.getUrlForEndpoint(endpoint, data);

    return this.getDataFromUrl(
      url,
      this.endpointsMethods[endpoint],
      data,
      headers,
      accessToken
    );
  }
  requestURL(url, method, data, headers, accessToken) {
    return this.getDataFromUrl(url, method, data, headers, accessToken);
  }
  /**
   * pass all endpoints from here to be free changing endpoints without breakChange
   * @param {string} endpoint
   * @param {undefined|{params:[string]}} endpoint
   * @return {string|undefined}
   */
  getUrlForEndpoint(endpoint, data) {
    let url = this.baseEndpoint + this.endpoints[endpoint];

    if (this.endpoints[endpoint].includes("theme"))
      url = this.baseEndpointTheme + this.endpoints[endpoint];

    if (!data || !data.params || !Array.isArray(data.params)) {
      return url;
    }
    /**
     * in case there is parameters need to be replaced in url, user can pass them, we will handle replacement
     * @example
     * 'test/jamal/{id1}/{another}/edit'
     * we will run throw passed params in data object.
     * final result will be something like
     * 'test/jamal/100/56/edit'
     */
    const regex = /{[^{}]+}/i;
    data.params.forEach(
      (param) => (url = url.replace(regex, /*urlParReplacement*/ param))
    );
    return url;
  }

  getDataFromUrl(url, method, data, headers, accessToken) {
    return axios({
      timeout: 10000,
      url: url,
      method: method || "post",
      data: data,
      headers: {
        Authorization: `Bearer ${
          accessToken || this.accessToken || this.themeAccessToken
        }`,
        "CF-Access-Client-Id": "695ade2783e811dc18e23b2334ac886c.access",
        "CF-Access-Client-Secret":
          "b2b925480ae38f3675525855dfcd934b811522263a3c9d7e99a0f9bd7bac86ac",
        ...(headers || {}),
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        Logger.longLine();

        Logger.error("Error in Endpoint: " + url);
        this.handleErrors(err);
        throw err;
      });
  }

  handleErrors(error) {
    if (error && error.response && error.response.data) {
      let data = error.response.data;
      let errorMessage = `${error.name}: ${error.message}`;
      Logger.longLine();
      if (!data || !data.error) {
        Logger.error(errorMessage);
        return false;
      }
      if (data.error && data.error.fields) {
        Object.entries(data.error.fields).forEach(([fieldName, errors]) => {
          Logger.error(`- ${fieldName}: `, errors);
        });
        return false;
      }
      if (
        data.error.message &&
        data.error.message.includes("authorization token")
      ) {
        Logger.error(
          `🛑 Oops! An invalid authorization token was found. Ensure to run the following command to login properly to Salla: ${
            "salla login".bold.cyan
          }`
        );

        return false;
      }

      if (data.error.message) {
        Logger.error(`${data.error.message}`);

        return false;
      }
      Logger.error(`${errorMessage}`);

      return false;
    }
    throw error;
  }
};
