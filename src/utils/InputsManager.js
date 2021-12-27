const readlineSync = require("readline-sync");
const Logger = require("../utils/LoggingManager");
const cliSelect = require("cli-select");
const chalk = require("chalk");
const fs = require("fs");
const clc = require("cli-color");
const { MultiSelect } = require("enquirer");
const { selectFiles } = require("select-files-cli");

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
  selectMulti(choices, lable, desc, required = false) {
    Logger.longLine();
    if (desc) {
      Logger.infoGray(desc);
      Logger.longLine();
    }
    const prompt = new MultiSelect({
      name: lable,
      message: lable,
      limit: choices.length,
      choices: choices,

      result(names) {
        return this.map(names);
      },
      required,
    });

    return prompt.run();
  }
  selectFile(desc) {
    Logger.longLine();
    if (desc) {
      Logger.infoGray(desc);
    }
    return selectFiles({
      directoryFilter: (directoryName) => {
        return !/node_modules$/gi.test(directoryName);
      },
      pageSize: 15,
    });
  }
  readLine(lable, { validate, name, errorMessage, desc, defaultVal } = {}) {
    Logger.longLine();
    if (desc) {
      Logger.infoGray(desc);
      Logger.longLine();
    }
    let defInput = "";
    if (defaultVal) {
      defInput = clc.italic(clc.blackBright(" ${([)defaultInput(])} "));
    }
    let val = readlineSync.question(
      "? " + lable.bold + clc.greenBright("\n>") + defInput + " ",
      {
        defaultInput: defaultVal,
      }
    );

    if (validate) {
      let isValidated = false;
      if (typeof validate == "function") isValidated = validate(val);
      else isValidated = validate.test(val);
      // try until validated
      if (!isValidated) {
        Logger.longLine();
        if (errorMessage) {
          Logger.error(errorMessage);
        } else {
          Logger.error(`🤔 Hmmm! ${name} is not valid! Please try again.`);
        }

        return this.readLine(lable, {
          validate,
          name,
          errorMessage,
          desc: null,
          defaultVal,
        });
      }
      return val;
    } else {
      return val;
    }
  }

  async selectInput(lable, values, desc) {
    Logger.longLine();
    if (desc) {
      Logger.infoGray(desc);
      Logger.longLine();
    }

    Logger.normal("? " + lable.bold);
    values = values.map((v) => {
      if (v.lable) {
        if (!v.desc) v.desc = "";
        else
          v.desc =
            " - " +
            clc.greenBright(v.desc.charAt(0).toUpperCase() + v.desc.slice(1));
      }
      return v;
    });
    let selectedVal = await cliSelect({
      values,
      valueRenderer: (value, selected) => {
        if (selected) {
          if (typeof value == "string") return chalk.bold(value);
          return chalk.bold(value.lable) + (value.desc || "");
        }
        if (typeof value == "string") return value;
        if (value.color)
          return value.lable + clc[value.color](value.desc || "");

        return value.lable + value.desc;
      },
    });

    if (selectedVal.value.value) {
      Logger.normal(selectedVal.value.value);
      return selectedVal.value.value;
    }
    if (!selectedVal.value) {
      Logger.normal(selectedVal);
      return selectedVal.toLowerCase();
    }
    if (!selectedVal.value.lable) {
      Logger.normal(selectedVal.value);
      return selectedVal.value.toLowerCase();
    }

    Logger.normal(selectedVal.value.lable);
    return selectedVal.value.lable.toLowerCase();
  }
  askYesNo(desc, warningDesc) {
    Logger.longLine();
    Logger.warn(warningDesc);
    Logger.longLine();
    return readlineSync.keyInYN(desc);
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
      "🎉 Hooray! You have successfully created a new Salla app! Please, run the following command to start your app:"
    );

    Logger.longLine();
    Logger.succ(`~# cd ${app_name} && salla app serve --port 8081 `);

    Logger.longLine();
  }
  catchCtrlC(app_name) {
    process.on("SIGINT", () => {
      this.exitingNormal = true;
      this.finalMessage(app_name);

      process.exit(1);
    });
  }
  errorCatch() {
    process.on("exit", () => {
      if (this.exitingNormal) return;
      Logger.longLine();
      Logger.printVisitTroubleshootingPage();
      process.exit(1);
    });
  }

  async getAppIDFromApps(title, desc, apps) {
    try {
      //  select app
      let SallaAppName = await this.selectInput(
        title,
        [
          /* apps from developer account */
          ...apps.map((app) => {
            return { lable: app.name.en, desc: app.type };
          }),
        ],
        desc
      );

      return apps.find(
        (app) =>
          app.name.en.toLocaleLowerCase() === SallaAppName.toLocaleLowerCase()
      );
    } catch (err) {
      return null;
    }
  }
}
module.exports = new InputsManager();
