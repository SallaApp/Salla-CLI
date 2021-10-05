const express = require("express");
const fs = require("fs");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const open = require("open");
const inquirerModule = require("inquirer");
const ConfManager = require("./utils/ConfigManager");
const AuthenticationManager = require("./utils/AuthenticationManager");

const { LOGIN_URL } = require("../../constants");
const { concatSeries } = require("async");

const wss = new WebSocket.Server({
  server: server,
});

class ThemeAuth {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   * @param authManager
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfManager(),
    AuthManager = new AuthenticationManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
    this._AuthManager = AuthManager;
    this._logger = logger;
  }

  async run() {
    const _this = this;
    // Opens the URL in the default browser.
    open(LOGIN_URL);
    wss.on("connection", function connection(ws) {
      //console.log('A new client Connected!');
      ws.on("message", function incoming(token) {
        console.log("received: %s", JSON.parse(token));
        // Store the token to disk for later program executions
        _this.saveAuth(token);
      });
    });
    app.get("/", (req, res) => res.send("Hello World!"));
    server.listen(9898, () => console.log(`Lisening on port :9898`));
  }

  async saveAuth(token) {
    let parsedToken;
    try {
      parsedToken = await this._AuthManager.save(token);
    } catch (err) {
      this._logger.error("Could not save the token");
    }
    return parsedToken || {};
  }

  checkIfTokenIsVailed() {
    //TODO
  }

  checkIfGithubTokenIsVailed() {
    //TODO
  }
}

module.exports = ThemeAuth;
