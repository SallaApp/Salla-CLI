const express = require("express");
const fs = require("fs");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const open = require("open");
const inquirerModule = require("inquirer");
const SallaConfigManager = require("./SallaConfigManager");

const { LOGIN_URL } = require("../../constants");

const TOKEN_PATH = "token.json";

const wss = new WebSocket.Server({
  server: server,
});

class SallaThemeAuth {
  /**
   * @param inquirer
   * @param SallaConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    sallaConfigManager = new SallaConfigManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._sallaConfigManager = sallaConfigManager;
    this._logger = logger;
  }

  async run() {
    // Opens the URL in the default browser.
    open(LOGIN_URL);
    wss.on("connection", function connection(ws) {
      //console.log('A new client Connected!');
      ws.on("message", function incoming(token) {
        console.log("received: %s", JSON.parse(token));
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, token, (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);

          //sent to client
          ws.send("Token stored");
        });
      });
    });

    app.get("/", (req, res) => res.send("Hello World!"));
    server.listen(9898, () => console.log(`Lisening on port :9898`));
  }

  checkIfTokenIsVailed() {
    //TODO
  }

  checkIfGithubTokenIsVailed() {
    //TODO
  }
}

module.exports = SallaThemeAuth;
