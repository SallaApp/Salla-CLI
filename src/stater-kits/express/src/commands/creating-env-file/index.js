const fs = require("fs-extra");
const messageFactory = require("../../helpers/message");
class Command {
  _message = "Creating .env file .";
  _running = false;
  isRunning() {
    return this._running;
  }

  _messages_output = [];

  start({
    app_path,
    app_client_id,
    app_client_secret,
    auth_mode,
    webhook_secret,
  }) {
    return new Promise((resolve, reject) => {
      this._running = true;

      try {
        fs.writeFileSync(
          `${app_path}/.env`,
          `
CLIENT_ID=${app_client_id}
CLIENT_SECRET=${app_client_secret}
AUTH_MODE=${auth_mode}
WEBHOOK_SECRET=${webhook_secret}
DATABASE_PASSWORD=
DATABASE_USERNAME=
DATABASE_SERVER=
SALLA_AUTHORIZATION_MODE=${auth_mode}
      `
        );

        this._messages_output.push(
          messageFactory.createMessage(
            `File .env created successfully .`,
            "succ"
          )
        );
        resolve(this._messages_output);
        this._running = false;
      } catch (err) {
        this._messages_output.push(
          messageFactory.createMessage(`Error ${this._message}`, "err")
        );
        reject(this._messages_output);
        this._running = false;
      }
    });
  }
}

module.exports = Command;
