const BaseClass = require("./utils/BaseClass");

//TODO:: move it to function to be called only when it needed.
const express = require("express");
const WebSocket = require("ws");
const http = require("http");

/**
 * @property {AuthOptions} options
 */
class Auth extends BaseClass {
  /**
   * auth.tokens() if it's invalid we will recall this function
   * so, '--force' is needed to avoid infinite loop.
   *
   * @return {Promise<{}|boolean>}
   */
  async run() {
    let tokens;
    if (!this.options.force) {
      tokens = await this.getTokens();
    }
    return tokens || this.getAuthTokens();
  }

  /**
   * @return {Promise<SallaConfigs>}
   */
  async getAuthTokens() {
    let port = this.options.port || AUTHENTICATION_PORT;
    const app = express();
    app.set("port", port);
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server: server });
    wss.on("error", (err) => {
      //handle error
      if (err.code === "EADDRINUSE") {
        this.log(
          `\nUse another port, then run ` +
            "salla theme auth --port <your_new_port>".yellow
        );
      }
    });

    await this.openBrowser(
      AUTH_URL + "?port=" + port + (this.options.force ? "&force=1" : "")
    ); // Opens the URL in the default browser.
    server.listen(port, () =>
      this.log("  Waiting for authentication data...".green)
    );
    wss.on("connection", (ws) => {
      ws.on("message", async (token) => {
        this.success("Authentication data received.");
        this.tokens = JSON.parse(token.toString());
        await this.authManager().save(this.tokens); // Store the token to disk for later program executions
        ws.send("Token stored");
        this.readyToReturn = true;
        server.close();
        wss.close();
        ws.close();
      });
    });
    await this.checkIsReadyToReturn();
    return this.tokens;
  }
}

module.exports = Auth;
