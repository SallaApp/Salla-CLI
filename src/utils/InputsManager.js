const readlineSync = require("readline-sync");
const Logger = require("../utils/LoggingManager");
const cliSelect = require("cli-select");
const chalk = require("chalk");
const fs = require("fs");
class InputsManager {
  APP_CLIENT_ID;
  APP_CLIENT_SECRET;
  WEBHOOK_SECRET;

  AUTH_MODE;

  getValues() {
    return {
      APP_CLIENT_ID: this.APP_CLIENT_ID,
      APP_CLIENT_SECRET: this.APP_CLIENT_SECRET,
      WEBHOOK_SECRET: this.WEBHOOK_SECRET,

      AUTH_MODE: this.AUTH_MODE,
    };
  }
  readLine(lable, { validate, name, errorMessage } = {}) {
    //Logger.longLine();
    let val = readlineSync.question(lable);
    if (validate) {
      // try until validated
      if (typeof validate == "function") {
        while (!validate(val)) {
          if (errorMessage) {
            Logger.error(errorMessage);
          } else {
            Logger.error(`Hmmm! ${name} is not valid! try again by entering a valid name.`);
          }
          //Logger.longLine();
          val = readlineSync.question(lable);
        }
      } else {
        while (!validate.test(val)) {
          if (errorMessage) {
            Logger.error(errorMessage);
          } else {
            Logger.error(`You must enter a valid ${name}! Please, try again by entering a valid name.`);
          }
          //Logger.longLine();
          val = readlineSync.question(lable);
        }
      }

      return val;
    } else {
      return val;
    }
  }

  async selectInput(lable, values) {
    //Logger.longLine();
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
    this.APP_CLIENT_SECRET = this.readLine("App Client Secret Key: ");
    return this.APP_CLIENT_SECRET;
  }
  getWebhookSecretFromCLI() {
    this.WEBHOOK_SECRET = this.readLine("App Webhook Secret Key: ");
    return this.WEBHOOK_SECRET;
  }
  async getDatabaseORMFromCLI() {
    let selectedORM = await this.selectInput(
      "App Database ORM: ",
      DATABASE_ORM
    );

    return selectedORM;
  }
  async getAuthModeFromCLI() {
    this.AUTH_MODE = await this.selectInput("App Authintication Mode: ", [
      "easy",
      "custom",
    ]);
    return this.AUTH_MODE;
  }
  checkProjectExists(folderPath, exit = false) {
    if (fs.existsSync(folderPath)) {
      Logger.error(
        `🤔 Hmmm! Looks like you already have a project in ${folderPath}. Please, either delete it and try again or use a different folder name.`
      );
      // Logger.error(
      //   `App name "${folderPath}" already exists! ..  exiting setup .`
      // );
      if (exit) {
        process.exit(1);
      }
    }
  }

  finalMessage(app_name) {
    Logger.normal("You have successfully created a new Salla app! Please, run the following command to start your app:");
    // Logger.normal("You Can continue developing the app using this command  :");

    Logger.longLine();
    Logger.succ(
      `~# cd ${app_name} && salla app serve --port 3000 --host`
    );
    // Logger.succ(
    //   `                    ~# cd ${app_name} && salla app serve                    `
    // );

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
