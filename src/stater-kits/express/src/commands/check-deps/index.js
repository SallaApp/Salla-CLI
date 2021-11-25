const commandExistsSync = require("command-exists").sync;

const messageFactory = require("../../../../../helpers/message");
class Command {
  _message = "Checking project required dependencies";
  _running = false;
  isRunning() {
    return this._running;
  }
  _commands = ["node", "npm"];
  _messages_output = [];
  start() {
    return new Promise((resolve, reject) => {
      this._running = true;

      Promise.all(this._commands.map((command) => this._execute(command)))
        .then((msgs) => {
          resolve(msgs);
          this._running = false;
        })
        .catch((msgs) => {
          this._messages_output.push(
            messageFactory.createMessage(`Error ${this._message}!`, "err")
          );
          this._running = false;

          reject([...msgs, this._messages_output]);
        });
    });
  }
  _execute(command) {
    return new Promise((resolve, reject) => {
      try {
        if (commandExistsSync(command)) {
          resolve([
            messageFactory.createMessage(`Command Found ${command} .`, "succ"),
          ]);
        } else {
          // multi errors here !

          reject([
            messageFactory.createMessage(
              `Command Not Found ${command}!`,
              "err"
            ),
          ]);
          return;
        }
      } catch (e) {
        // multi errors here !

        reject([
          messageFactory.createMessage(`Error ${this._message}!`, "err"),
        ]);
      }
    });
  }
}

module.exports = Command;
