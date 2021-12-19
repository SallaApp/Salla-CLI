/**
 * @typedef {{access_token: string, store_id: number, store_url: string}} SallaAuthConfig
 */

class SallaAuthApi {
  AuthManager;
  constructor() {}

  setAuthManager(AuthManager) {
    this.AuthManager = AuthManager;
  }
  async generateConnectionTokenEndpoint(randromIdentify) {
    try {
      const res = await this.SallaApi().requestURL(
        `${BASE_URL}/auth/generate-connection-token?identify=${randromIdentify}`,
        "POST",
        { identify: randromIdentify },
        null,
        null
      );
      if (res.status == 200) {
        return res.data.token;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  SallaApi() {
    if (!this.SallaApiObj) {
      const SallaAPI = require("../../api/SallaApi");
      this.SallaApiObj = new SallaAPI();
    }
    return this.SallaApiObj;
  }
  async isSallaTokenValid(sallaConfigObj) {
    if (!sallaConfigObj || !sallaConfigObj.access_token) {
      return false;
    }

    try {
      let user = await this.SallaApi().request("me");
      if (user && user.success) {
        this.SallaApi().setAccessToken(sallaConfigObj.access_token);
        return true;
      }
    } catch (err) {}

    return false;
  }
}

module.exports = SallaAuthApi;
