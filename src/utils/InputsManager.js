const readlineSync = require("readline-sync");
const Logger = require("../utils/LoggingManager");
const cliSelect = require("cli-select");
const chalk = require("chalk");
const fs = require("fs");
class InputsManager {
  APP_CLIENT_ID;
  APP_CLIENT_SECRET;
  WEBHOOK_SECRET;
  DATABASE_ORM;
  APP_MODE;

  getValues() {
    return {
      APP_CLIENT_ID: this.APP_CLIENT_ID,
      APP_CLIENT_SECRET: this.APP_CLIENT_SECRET,
      WEBHOOK_SECRET: this.WEBHOOK_SECRET,
      DATABASE_ORM: this.DATABASE_ORM,
      APP_MODE: this.APP_MODE,
    };
  }
  readLine(lable) {
    Logger.longLine();
    return readlineSync.question(lable);
  }

  async selectInput(lable, values) {
    Logger.longLine();
    Logger.normal(lable);
    let selectedVal = await cliSelect({
      values,
      valueRenderer: (value, selected) => {
        if (selected) {
          return chalk.bold(value);
        }
        return value;
      },
    });
    Logger.normal(selectedVal.value);
    return selectedVal.value;
  }
  getClientIDFromCLI() {
    this.APP_CLIENT_ID = this.readLine("App Client ID: ");
    return this.APP_CLIENT_ID;
  }
  getClientSecretFromCLI() {
    this.APP_CLIENT_SECRET = this.readLine("App Client Secret: ");
    return this.APP_CLIENT_SECRET;
  }
  getWebhookSecretFromCLI() {
    this.WEBHOOK_SECRET = this.readLine("App Webhook Secret: ");
    return this.WEBHOOK_SECRET;
  }
  async getDatabaseORMFromCLI() {
    this.DATABASE_ORM = (
      await this.selectInput("App Database ORM: ", DATABASE_ORM)
    ).value;
    return this.DATABASE_ORM;
  }
  checkProjectExists(folderPath, exit = false) {
    if (fs.existsSync(folderPath)) {
      Logger.error(
        `App name "${folderPath}" already exists! ..  exiting setup .`
      );
      if (exit) {
        process.exit(1);
      }
    }
  }

  finalMessage(app_name) {
    Logger.normal("You Can continue developing the app using this command  :");

    Logger.longLine();
    Logger.succ(
      `                    ~# cd ${app_name} && salla app serve                    `
    );

    Logger.longLine();

    Logger.normal("As always, happy hacking! 🙌");
    Logger.longLine();
  }
  catchCtrlC(app_name) {
    process.on("SIGINT", () => {
      this.finalMessage(app_name);
      process.exit(1);
    });
  }
}
module.exports = new InputsManager();
