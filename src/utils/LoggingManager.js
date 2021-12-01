const clc = require("cli-color");

class LoggingManager {
  visitTroubleshootingPage =
    "Please visit the troubleshooting page https://dev.salla.sa/";
  submitGithubIssue =
    "If this error persists, please visit https://github.com/sallaapp/salla-cli/issues and submit an issue.";
  constructor() {
    this.instant_print = false;
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
    this.info(this.visitTroubleshootingPage);
    this.info(this.submitGithubIssue);
  }
  // print array of messages
  printMessages(msgs) {
    msgs = this.__flatArray(msgs);

    for (let i = 0; i < msgs.length; i++) {
      this.longLine();
      console.log(clc[msgs[i].color](msgs[i].msg));
      if (msgs[i].sideMessage) console.log(clc["red"](msgs[i].sideMessage));
    }
  }

  // print a long line
  longLine = () => console.log("                     ");

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
    this.longLine();
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
    if (!msg) throw new Error("msg is required");
    let msgObj = {};

    if (type == "err")
      msgObj = { msg: `[x] ${msg}`, color: "redBright", type, sideMessage };
    if (type == "side-err")
      msgObj = { msg: `[x] ${msg}`, color: "red", type, sideMessage };
    if (type == "succ")
      msgObj = { msg: `[ok] ${msg}`, color: "greenBright", type, sideMessage };
    if (type == "info")
      msgObj = { msg: `[!] ${msg}`, color: "blueBright", type, sideMessage };
    if (type == "warn")
      msgObj = { msg: `[!] ${msg}`, color: "yellow", type, sideMessage };

    if (this.instant_print) this.printMessage(msgObj);

    return msgObj;
  }
  error(msg, ...msgs) {
    if (msgs.length > 0)
      msgs.map((msg) => this.printMessage(this.createMessage(msg, "side-err")));
    return this.printMessage(this.createMessage(msg, "err"));
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
  normal(msg, ...msgs) {
    if (msgs.length > 0) console.log(msg, msgs);
    else console.log(msg);
    return;
  }
}
module.exports = new LoggingManager();
