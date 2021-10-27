const BaseClass = require('./utils/BaseClass');

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
     * @param {{force:boolean|undefined, port:number|undefined}} options
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
     * @return {Promise<boolean>}
     */
    async getAuthTokens() {
        let port = this.options.port || AUTHENTICATION_PORT;
        const server = http.createServer(express());
        const wss = new WebSocket.Server({server: server});
        server.listen(port, () => this.log('  Waiting for authentication data...'.green));

        this.openBrowser(AUTH_URL + "?port=" + port + (this.options.force ? '&force=1' : '')); // Opens the URL in the default browser.
        wss.on("connection", (ws) => {
            ws.on("message", async token => {
                this.success("Authentication data received.");
                await this.authManager().save(JSON.parse(token.toString())); // Store the token to disk for later program executions
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
