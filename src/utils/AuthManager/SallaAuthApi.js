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
}

module.exports = SallaAuthApi;
