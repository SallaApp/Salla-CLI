const clc = require("cli-color");
const loading = require("loading-cli");

const chalkAnimation = require("chalk-animation");
class LoggingManager {
  visitTroubleshootingPage =
    "Please visit the troubleshooting page https://dev.salla.sa/";
  submitGithubIssue =
    "If this error persists, please visit https://github.com/sallaapp/salla-cli/issues and submit an issue.";
  constructor() {
    this.instant_print = false;
  }
  loading(text) {
    return loading({
      text: clc.blackBright(text),

      interval: 140,
      stream: process.stdout,

      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    }).start();
  }
  setInstantPrint(bool) {
    this.instant_print = bool;
  }
  printCliResultErrorAndExit(error) {
    this.printCliResultError(error);
    // Exit with error code so automated systems recognize it as a failure
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
  printCliResultError(error) {
    this.error(error);
    if (error && Array.isArray(error.messages)) {
      for (const item of error.messages) {
        if (item && item.message) {
          this.error(error);
        }
      }
    }
    this.printVisitTroubleshootingPage();
  }
  printVisitTroubleshootingPage() {
    this.warn(this.visitTroubleshootingPage);
    this.warn(this.submitGithubIssue);
  }
  // print array of messages
  printMessages(msgs) {
    msgs = this.__flatArray(msgs);

    for (let i = 0; i < msgs.length; i++) {
      //this.longLine();
      if (typeof msgs[i].msg == "undefined") continue;
      console.log(clc[msgs[i].color](msgs[i].msg));
      if (msgs[i].sideMessage) console.log(clc["red"](msgs[i].sideMessage));
    }
  }

  // print a long line
  longLine = (n) => {
    return console.log("                     ");
  };

  __flatArray(arr) {
    if (typeof arr === "object" && !arr.length) return [arr];
    if (!arr) return [];
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        newArr = newArr.concat(this.__flatArray(arr[i]));
      } else {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }
  // print message object
  printMessage(msg) {
    if (!msg) return;
    // this.longLine();
    console.log(clc[msg.color](msg.msg));
    if (msg.sideMessage) console.log(clc["red"](msg.sideMessage));
  }
  /**
   *
   * @property {String} msg - The message to print
   * @property {String "err" | "succ" | "info" } type - type of message
   * @property {String|undefined} sideMessage - side message
   */
  createMessage(msg, type, sideMessage) {
    if (msg.length == 0) return;
    if (!msg) throw new Error("msg is required");
    let msgObj = {};

    if (type == "err")
      msgObj = {
        msg: `[x] ${msg}`,
        color: "redBright",
        type,
        sideMessage,
      };
    if (type == "side-err")
      msgObj = {
        msg: `[x] ${msg}`,
        color: "red",
        type,
        sideMessage,
      };
    if (type == "succ")
      msgObj = {
        msg: `[✓] ${msg}`,
        color: "greenBright",
        type,
        sideMessage,
      };
    if (type == "info")
      msgObj = {
        msg: `[!] ${msg}`,
        color: "cyanBright",
        type,
        sideMessage,
      };
    if (type == "warn")
      msgObj = {
        msg: `[!] ${msg}`,
        color: "yellow",
        type,
        sideMessage,
      };

    if (type == "gray")
      msgObj = {
        msg: clc.italic(`${msg}`),
        color: "blackBright",
        type,
        sideMessage,
      };
    if (this.instant_print) this.printMessage(msgObj);

    return msgObj;
  }
  error(msg, ...msgs) {
    this.printMessage(this.createMessage(msg, "err"));
    if (msgs.length > 0)
      msgs.map((msg) => this.printMessage(this.createMessage(msg, "side-err")));
    return;
  }
  warn(msg, ...msgs) {
    if (msgs.length > 0)
      msgs.map((msg) => this.printMessage(this.createMessage(msg, "warn")));
    return this.printMessage(this.createMessage(msg, "warn"));
  }
  succ(msg, ...msgs) {
    if (msgs.length > 0)
      msgs.map((msg) => this.printMessage(this.createMessage(msg, "succ")));
    return this.printMessage(this.createMessage(msg, "succ"));
  }
  success(msg, ...msgs) {
    return this.succ(msg, msgs);
  }

  info(msg, ...msgs) {
    if (msgs.length > 0)
      msgs.map((msg) => this.printMessage(this.createMessage(msg, "info")));
    this.printMessage(this.createMessage(msg, "info"));
    return;
  }
  infoGray(msg, ...msgs) {
    if (msgs.length > 0)
      msgs.map((msg) => this.printMessage(this.createMessage(msg, "gray")));
    this.printMessage(this.createMessage(msg, "gray"));
    return;
  }
  normal(msg, ...msgs) {
    if (msgs.length > 0) console.log(msg, msgs);
    else console.log(msg);
    return;
  }
  showHeadWithWelcomeMessage(val) {
    this.showWelcomeMessage = val;
  }
  printHead(program, version) {
    let sallaText = `
        _____       _ _          _____ _      _____ 
       / ____|     | | |        / ____| |    |_   _|
      | (___   __ _| | | __ _  | |    | |      | |  
       \\___ \\ / _\` | | |/ _\` | | |    | |      | |  
       ____) | (_| | | | (_| | | |____| |____ _| |_ 
      |_____/ \\__,_|_|_|\\__,_|  \\_____|______|_____|
    `;

    if (!program) {
      console.log(clc.greenBright(sallaText));
    } else {
      program.addHelpText("before", sallaText.green);
    }
    console.log(clc.greenBright("                     Version: " + version));

    return new Promise((resolve) => {
      const textAnimated = chalkAnimation.rainbow(
        "        The Official Salla Command Line Interface"
      );
      textAnimated.start();

      setTimeout(() => {
        this.longLine();
        this.info("Read the docs: https://github.com/SallaApp/Salla-CLI/ ");
        this.info(
          "Support and bugs: https://github.com/SallaApp/Salla-CLI/issues "
        );

        this.longLine();
        textAnimated.stop();
        if (this.showWelcomeMessage) {
          this.infoGray(
            "Welcome 🤗 to The Official Salla Command Line Interface ..\nmake sure you login to your Salla Account by running: " +
              clc.bgWhite("salla login")
          );
          this.longLine();
        }
        resolve();
      }, 1000);
    });
  }
}
module.exports = new LoggingManager();
