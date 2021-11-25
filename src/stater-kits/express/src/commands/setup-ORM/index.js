const fs = require("fs-extra");
const messageFactory = require("../../../../../helpers/message");
const replace = require("replace-in-file");

class Command {
  // needs chacking paths
  _message = "Setup Preferred ORM .";
  _running = false;
  isRunning() {
    return this._running;
  }

  _messages_output = [];

  start({ app_path, database_orm, src }) {
    return new Promise(async (resolve, reject) => {
      this._running = true;

      try {
        fs.copySync(
          `${src}/ORMs/${database_orm}`,
          `${app_path}/database/${database_orm}`
        );
        await replace({
          files: app_path + "/app.js",
          from: '"%{DATABASE_ORM_CODE_HERE}"',
          to: fs.readFileSync(`${__dirname}/templates/${database_orm}.code`),
        }).then(() => {
          return replace({
            files: app_path + "/app.js",
            from: "%{ORM_SELECTED}",
            to: database_orm,
          });
        });

        this._messages_output.push(
          messageFactory.createMessage(
            `${this._message} successfully .`,
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
