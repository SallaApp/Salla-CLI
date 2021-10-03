const express = require("express");
const fs = require("fs");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const open = require("open");
const inquirerModule = require("inquirer");
const ConfManager = require("./utils/ConfigManager");
const homedir = require('os').homedir();
const path = require("path");
const dir = homedir + '/.salla';
const configPath = path.join(dir, "config.json");

const {
  LOGIN_URL
} = require("../../constants");

const wss = new WebSocket.Server({
  server: server,
});

class ThemeAuth {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
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
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          });
        }
        fs.writeFile(configPath, token, (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", configPath);
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

module.exports = ThemeAuth