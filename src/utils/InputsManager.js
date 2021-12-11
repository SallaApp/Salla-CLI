const readlineSync = require("readline-sync");
const Logger = require("../utils/LoggingManager");
const cliSelect = require("cli-select");
const chalk = require("chalk");
const fs = require("fs");
const clc = require("cli-color");

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
  readLine(lable, { validate, name, errorMessage, desc } = {}) {
    Logger.longLine();
    if (desc) Logger.infoGray(desc);

    let val = readlineSync.question(
      "? " + lable.bold + clc.greenBright("\n>") + " "
    );

    if (validate) {
      let isValidated = false;
      if (typeof validate == "function") isValidated = validate(val);
      else isValidated = validate.test(val);
      // try until validated
      while (!isValidated) {
        Logger.longLine();
        if (errorMessage) {
          Logger.error(errorMessage);
        } else {
          Logger.error(`🤔 Hmmm! ${name} is not valid! Please try again.`);
        }
        Logger.longLine();
        if (desc) Logger.infoGray(desc);
        val = readlineSync.question(
          "? " + lable.bold + clc.greenBright("\n>") + " "
        );
        if (typeof validate == "function") isValidated = validate(val);
        else isValidated = validate.test(val);
      }
      return val;
    } else {
      return val;
    }
  }

  async selectInput(lable, values, desc) {
    Logger.longLine();
    if (desc) Logger.infoGray(desc);
    Logger.normal("? " + lable.bold);

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
    this.APP_CLIENT_ID = this.readLine("? App Client ID: ");
    return this.APP_CLIENT_ID;
  }
  getClientSecretFromCLI() {
    this.APP_CLIENT_SECRET = this.readLine("? App Client Secret Key: ");
    return this.APP_CLIENT_SECRET;
  }
  getWebhookSecretFromCLI() {
    this.WEBHOOK_SECRET = this.readLine("? App Webhook Secret Key: ");
    return this.WEBHOOK_SECRET;
  }

  checkProjectExists(folderPath, exit = false) {
    if (fs.existsSync(folderPath)) {
      Logger.error(
        `🤔 Hmmm! Looks like you already have a project in ${folderPath}. Please, either delete it and try again or use a different folder name.`
      );

      if (exit) {
        process.exit(1);
      }
    }
  }

  finalMessage(app_name) {
    Logger.normal(
      "🎉 Horay! You have successfully created a new Salla app! Please, run the following command to start your app:"
    );
    // Logger.normal("You Can continue developing the app using this command  :");

    Logger.longLine();
    Logger.succ(`~# cd ${app_name} && salla app serve --port 3000 --host`);

    Logger.longLine();
  }
  catchCtrlC(app_name) {
    process.on("SIGINT", () => {
      this.finalMessage(app_name);
      process.exit(1);
    });
  }
  errorCatch() {
    process.on("exit", () => {
      Logger.longLine();
      Logger.printVisitTroubleshootingPage();
      process.exit(1);
    });
  }
}
module.exports = new InputsManager();
