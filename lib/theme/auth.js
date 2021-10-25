const BaseClass = require('./utils/BaseClass');

//TODO:: move it to function to be called only when it needed.
const express = require("express");
const WebSocket = require("ws");
const http = require("http");

class Auth extends BaseClass {

    /**
     * auth.tokens() if it's invalid we will recall this function
     * so, '--force' is needed to avoid infinite loop.
     *
     * @param {{force:boolean|undefined}} options
     * @return {Promise<{}|boolean>}
     */
    async run(options) {
        let tokens;
        if (!options.force) {
            tokens = await this.getTokens();
        }
        return tokens || this.getAuthTokens(options.force);
    }

    /**
     *
     * @param {boolean|undefined} force
     * @return {Promise<boolean>}
     */
    async getAuthTokens(force) {
        const server = http.createServer(express());
        const wss = new WebSocket.Server({server: server});

        server.listen(AUTHENTICATION_PORT, () => this.log('  Waiting for authentication data...'.green));
        let url =  force ? FORCE_RE_AUTH_URL + "&port=" + AUTHENTICATION_PORT : AUTH_URL + "?port=" + AUTHENTICATION_PORT;

        this.openBrowser(url); // Opens the URL in the default browser.
        wss.on("connection", (ws) => {
            ws.on("message", async token => {
                this.success("Authentication data received.");
                await this.authManager().save(token); // Store the token to disk for later program executions
                ws.send("Token stored");
                this.readyToReturn = true;
                server.close();
                wss.close();
                ws.close();
            });
        });
        await this.checkIsReadyToReturn();
        return this.readyToReturn;
    }
}

module.exports = Auth;
