const fs = require("fs-extra");
const messageFactory = require("../../helpers/message");
const exec = require("child_process").exec;
class Command {
  _message = "Creating Package.json ";
  _running = false;
  isRunning() {
    return this._running;
  }

  _messages_output = [];
  packages = [
    ["@salla.sa/passport-strategy", "^1.0.2"],
    ["@salla.sa/webhooks-actions", "^1.0.0"],
    ["body-parser", "^1.19.0"],
    ["consolidate", "^0.15.0"],
    ["dotenv", "^8.2.0"],
    ["express", "^4.17.1"],
    ["express-session", "^1.15.6"],
    ["nunjucks", "^3.2.1"],
    ["passport", "^0.1.0"],
  ];
  start({ app_path, database_orm, auth_mode }) {
    return new Promise((resolve, reject) => {
      this._running = true;

      if (database_orm == "Sequelize") {
        this.packages.push(["sequelize", "^6.12.0-alpha.1"]);
        this.packages.push(["mysql2", "^2.3.3"]);
      }
      if (database_orm == "Mongoose") {
        this.packages.push(["mongoose", "6.0.13"]);
        this.packages.push(["validator", "^10.0.0"]);
      }
      if (database_orm == "TypeORM") {
        this.packages.push(["typeorm", "0.2.41"]);
        this.packages.push(["mysql2", "^2.3.3"]);
      }
      if (auth_mode == "easy") {
        this.packages.push(["ngrok", "^4.2.2"]);
      }
      try {
        exec("npm init -y", { cwd: app_path + "/" }, (err, stdout, stderr) => {
          if (err) {
            this._running = false;
            this._messages_output.push(
              messageFactory.createMessage(`Error ${this._message}`, "err")
            );

            reject(this._messages_output);
            return;
          }
          const packageJSON = JSON.parse(
            fs.readFileSync(`${app_path}/package.json`)
          );
          packageJSON.scripts = { "start-app": "node app.js" };
          packageJSON.description =
            "New Awesome Application using Salla API and NodeJS";
          packageJSON.dependencies = this.packages.reduce(
            (a, v) => ({ ...a, [v[0]]: v[1] }),
            {}
          );
          fs.writeFileSync(
            `${app_path}/package.json`,
            JSON.stringify(packageJSON, null, 2)
          );
          this._messages_output.push(
            messageFactory.createMessage(
              `package.json file created successfully .`,
              "succ"
            )
          );
          this._running = false;
          resolve(this._messages_output);
        });
      } catch (err) {
        this._messages_output.push(
          messageFactory.createMessage(`Error ${this._message}`, "err")
        );
        this._running = false;
        reject(this._messages_output);
      }
    });
  }
}

module.exports = Command;
