const Logger = require("../LoggingManager");
const InputsManager = require("../InputsManager");
const fs = require("fs-extra");
const { execSync } = require("child_process");
/**
 * @typedef {{access_token: string, store_id: number, store_url: string}} SallaAuthConfig
 */
class SallaAuthApi {
  AuthManager;
  constructor() {}

  setAuthManager(AuthManager) {
    this.AuthManager = AuthManager;
  }
  async isSallaTokenValid(sallaConfigObj) {
    if (!sallaConfigObj || !sallaConfigObj.access_token) {
      return false;
    }
    const SallaApi = require("../../api/SallaApi");
    const SallaApiObj = new SallaApi();

    SallaApiObj.setAccessToken(sallaConfigObj.access_token);

    try {
      let user = await SallaApiObj.request("me");
      if (user && user.success) {
        return true;
      }
    } catch (err) {}

    return false;
  }
}

module.exports = SallaAuthApi;
