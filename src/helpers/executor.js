// importing module dependencies
const commandExistsSync = require("command-exists").sync;
const fs = require("fs-extra");
const messageFactory = require("../helpers/message");
const replace = require("replace-in-file");
const { execSync } = require("child_process");
const cliProgress = require("cli-progress");
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
        const executor = new Executor()
        executor.run([
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

  
*/
module.exports = class Executor {
  constructor() {}
  async __start(commands) {
    let messages = [];
    if (progressBar) progressBar.start(commands.length, 0);
    let i = 1;
    for (let command in commands) {
      command = commands[command];
      if (progressBar)
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

                // we just compare the sums of versions
                // TODO : imporve this
                if (
                  version
                    .replace("v", "")
                    .split(".")
                    .reduce((c, p) => parseInt(c) + parseInt(p)) <
                  command.version
                    .split(".")
                    .reduce((c, p) => parseInt(c) + parseInt(p))
                ) {
                  messages.push(
                    messageFactory.error(
                      `${version} version is less than ${command.version}`
                    )
                  );
                  continue;
                }
              }

              messages.push(
                messageFactory.createMessage(
                  `Command Found ${command.name} .`,
                  "succ"
                )
              );
            } else {
              messages.push(
                messageFactory.createMessage(
                  `Command Not Found ${command.name}!`,
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
          messageFactory.createMessage(`Success  ${command.msg} .`, "succ")
        );
      } catch (err) {
        messages.push(
          messageFactory.createMessage(
            `Error Running : ${command.msg}!`,
            "err",
            err
          )
        );
        return messages;
      }
    }
    return messages;
  }

  run(arrayOFcommands) {
    return new Promise(async (resolve, reject) => {
      const messages = await this.__start(arrayOFcommands);
      progressBar.stop();

      resolve(messages);
    });
  }
};
