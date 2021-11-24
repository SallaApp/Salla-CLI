const fs = require("fs-extra");
const messageFactory = require("../../helpers/message");
const replace = require("replace-in-file");
class Command {
  _message = "Setup Project mode .";
  _running = false;
  isRunning() {
    return this._running;
  }

  _messages_output = [];

  start({
    app_path,

    auth_mode,
  }) {
    return new Promise(async (resolve, reject) => {
      this._running = true;
      try {
        if (auth_mode == "easy") {
          await replace({
            files: app_path + "/app.js",
            from: '//"{%EASY_MODE_CODE%}"',
            to: fs.readFileSync(`${__dirname}/templates/ngrok.js`),
          });
        } else {
          await replace({
            files: app_path + "/app.js",
            from: '//"{%EASY_MODE_CODE%}"',
            to: `console.log("    =>    Remote App Url : NO REMOTE URL (create project with easy mode to have remote url) ");`,
          });
        }
        this._messages_output.push(
          messageFactory.createMessage(
            `${this._message} successfully .`,
            "succ"
          )
        );
        resolve(this._messages_output);
      } catch (err) {
        this._messages_output.push(
          messageFactory.createMessage(`Error ${this._message}`, "err")
        );
        reject(this._messages_output);
      }
      this._running = false;
    });
  }
}

module.exports = Command;
