const fs = require("fs-extra");
const messageFactory = require("../../../../../helpers/message");
class Command {
  _message = "Copying main files and folders to new project";
  _running = false;

  isRunning() {
    return this._running;
  }

  _messages_output = [];
  start({ app_path, src }) {
    return new Promise((resolve, reject) => {
      this._running = true;
      try {
        // make project folder
        fs.mkdirSync(app_path);

        // copy template files to project folder
        fs.copyFileSync(`${src}/app.js`, `${app_path}/app.js`);

        fs.copyFileSync(`${src}/.gitignore`, `${app_path}/.gitignore`);
        fs.copySync(`${src}/views`, `${app_path}/views`);
        fs.copySync(`${src}/helpers`, `${app_path}/helpers`);
        fs.copySync(`${src}/Actions`, `${app_path}/Actions`);
        // set a way to copy ORM to database folder !

        fs.copySync(`${src}/database`, `${app_path}/database`);
        this._messages_output.push(
          messageFactory.createMessage(`${this._message} .`, "succ")
        );
        resolve(this._messages_output);

        this._running = false;
      } catch (err) {
        console.log("err", err);
        this._messages_output.push(
          messageFactory.createMessage(`Error ${this._message}!`, "err")
        );
        this._running = false;

        reject(this._messages_output);
      }
    });
  }
}

module.exports = Command;
