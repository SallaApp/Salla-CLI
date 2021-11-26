// importing module dependencies
const commandExistsSync = require("command-exists").sync;
const fs = require("fs-extra");
const messageFactory = require("../helpers/message");
const replace = require("replace-in-file");
const { execSync } = require("child_process");

/*
  [*] This class is used to execute commands and orgnize output messages

  example : 
      ** check node version 
        const executor = new Executor(progressBar)
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
  constructor(progressBar) {
    this.progressBar = progressBar;
  }
  async __start(progressBar, commands) {
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
                let version = execSync(`${command.name} -v`).toString();

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
            try {
              fs.mkdirSync(command.path);
              messages.push(
                messageFactory.createMessage(
                  `Success  ${command.msg} .`,
                  "succ"
                )
              );
            } catch (err) {
              messages.push(
                messageFactory.createMessage(`Error ${command.msg}!`, "err")
              );
            }

            break;

          case "copy":
            try {
              fs.copySync(`${command.src}`, `${command.dest}`);

              messages.push(
                messageFactory.createMessage(
                  `Success  ${command.msg} .`,
                  "succ"
                )
              );
            } catch (err) {
              messages.push(
                messageFactory.createMessage(`Error ${command.msg}!`, "err")
              );
            }
            break;
          case "copyMulti":
            try {
              for (let file in command.files)
                fs.copySync(
                  `${command.src}/${command.files[file]}`,
                  `${command.dest}/${command.files[file]}`
                );

              messages.push(
                messageFactory.createMessage(
                  `Success  ${command.msg} .`,
                  "succ"
                )
              );
            } catch (err) {
              messages.push(
                messageFactory.createMessage(`Error ${command.msg}!`, "err")
              );
            }
            break;
          case "create":
            try {
              if (typeof command.content == "function")
                command.content = command.content();
              fs.writeFileSync(`${command.path}`, command.content);

              messages.push(
                messageFactory.createMessage(
                  `Success  ${command.msg} .`,
                  "succ"
                )
              );
            } catch (err) {
              messages.push(
                messageFactory.createMessage(`Error ${command.msg}!`, "err")
              );
            }

            break;

          case "replace":
            try {
              await replace({
                files: command.path,
                from: command.from,
                to: command.to,
              });
              messages.push(
                messageFactory.createMessage(
                  `Success  ${command.msg} .`,
                  "succ"
                )
              );
            } catch (err) {
              messages.push(
                messageFactory.createMessage(`Error ${command.msg}!`, "err")
              );
            }

            break;
          case "exec":
            try {
              execSync(command.command, { cwd: command.path });
              messages.push(
                messageFactory.createMessage(
                  `Success  ${command.msg} .`,
                  "succ"
                )
              );
            } catch (err) {
              messages.push(
                messageFactory.createMessage(`Error ${command.msg}!`, "err")
              );
            }

            break;
        }
      } catch (err) {
        messages.push(
          messageFactory.createMessage(`Error Running : ${command.msg}!`, "err")
        );
      }
    }
    return messages;
  }

  run(arrayOFcommands) {
    return new Promise(async (resolve, reject) => {
      const messages = await this.__start(this.progressBar, arrayOFcommands);
      if (this.progressBar) this.progressBar.stop();

      resolve(messages);
    });
  }
};
