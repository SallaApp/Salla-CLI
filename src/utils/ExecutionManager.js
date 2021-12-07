// importing module dependencies
const commandExistsSync = require("command-exists").sync;
const fs = require("fs-extra");
const Logger = require("./LoggingManager");
const replace = require("replace-in-file");
const { execSync } = require("child_process");
const cliProgress = require("cli-progress");
const semver = require("semver");
// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar(
  {
    format: " {process} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_grey
);
/*
  [*] This class is used to execute commands and orgnize output messages

  example : 
      ** check node version 
        const executionManager = new ExecutionManager()
        executionManager.run([
          {
            cmd: "check",
            name: "node",
            version: "10.x.x",
            msg: "Checking Node Version",
          }])

  [*] types of commands :
        1- check : check if a command is installed 
        2- makedir: make directory
        3- copy : copy file or directory
        4- replace: replace file content
        5- copyMulti : copy multiple files or directories
        6- exec: execute a command
        7- create: create a file

  [*] You can execute salla commands with the following syntax :
       const executionManager = new ExecutionManager()
        executionManager.salla.theme()
  
*/
module.exports = class ExecutionManager {
  constructor() {
    // TODO: implement salla commands
    this.salla = {
      theme: (command_options) => {
        return execSync("salla theme " + command_options + " --nohead", {
          stdio: "inherit",
          cwd: BASE_PATH,
        });
      },
      app: (command_options) => {
        return execSync("salla app " + command_options + " --nohead", {
          stdio: "inherit",
          cwd: BASE_PATH,
        });
      },
      serve: (command_options) => {
        return execSync("salla serve " + command_options + " --nohead", {
          stdio: "inherit",
          cwd: BASE_PATH,
        });
      },
    };
  }
  async __start(commands, progress) {
    if (!Array.isArray(commands)) {
    }
    let messages = [];

    if (progress && progressBar) progressBar.start(commands.length, 0);
    let i = 1;
    for (let command in commands) {
      command = commands[command];
      if (progress && progressBar)
        progressBar.update(i, {
          process: command.msg,
        });
      i++;

      try {
        switch (command.cmd) {
          case "check":
            if (commandExistsSync(command.name)) {
              if (command.version) {
                let version = execSync(`${command.name} -v`, {
                  stdio: "pipe",
                }).toString();

                const satisfies = semver.satisfies(version, command.version);
                if (!satisfies)
                  messages.push(
                    Logger.error(
                      `Hmmm! The ${command.name} version must be ${command.version} or newer. Your version is ${version}, so please update it or install it manually.`
                    )
                  );
                continue;
              }

              messages.push(
                Logger.createMessage(
                  `Hooray! The following Command ${command.name} has been found.`,
                  "success!"
                )
              );
            } else {
              messages.push(
                Logger.createMessage(
                  `Hmmm! The following Command ${command.name} has not been found.`,
                  "err"
                )
              );
            }

            break;
          case "makedir":
            fs.mkdirSync(command.path);

            break;

          case "copy":
            fs.copySync(`${command.src}`, `${command.dest}`);

            break;
          case "copyMulti":
            for (let file in command.files)
              fs.copySync(
                `${command.src}/${command.files[file]}`,
                `${command.dest}/${command.files[file]}`
              );

            break;
          case "create":
            if (typeof command.content == "function")
              command.content = command.content();
            fs.writeFileSync(`${command.path}`, command.content);

            break;

          case "replace":
            await replace({
              files: command.path,
              from: command.from,
              to: command.to,
            });

            break;
          case "exec":
            execSync(command.command, {
              cwd: command.path,
              stdio: "pipe",
            });

            break;
        }
        messages.push(
          Logger.createMessage(`Hooray! Success ${command.msg} `, "succ")
        );
      } catch (err) {
        messages.push(
          Logger.createMessage(
            `Hmmm! An error occured while running : ${command.msg}!`,
            "err",
            err
          )
        );
        return messages;
      }
    }
    return messages;
  }

  checkNodeVersion(version) {
    return this.run(
      {
        cmd: "check",
        name: "node",
        version: version,
        msg: "Looking up Node's Version.",
      },
      {
        progress: false,
      }
    );
  }
  run(arrayOFcommands, { progress = true } = {}) {
    if (!Array.isArray(arrayOFcommands)) arrayOFcommands = [arrayOFcommands];
    return new Promise(async (resolve, reject) => {
      const messages = await this.__start(arrayOFcommands, progress);
      if (progress) progressBar.stop();

      resolve(messages);
    });
  }
};
