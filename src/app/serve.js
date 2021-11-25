const commandExistsSync = require("command-exists").sync;
const { exec, spawn } = require("child_process");
const ngrok = require("ngrok");
const fs = require("fs");
const {
  createMessage,
  printMessage,
  printMessages,
} = require("../helpers/message");

module.exports = async function (options) {
  // steps to create an app
  /*

      → salla app serve → check the type of project for current folder
          → laravel → php artisan serve run the app under port
        → express → node serve to un the app under the port
        → ngrok http {port}
        → update the web hook & redirect url in the app api
      submit the url hooks based on easy or hard modes ! 
  
  */
  // check if ngrok is installed
  if (!commandExistsSync("ngrok")) {
    printMessage(
      createMessage(
        "Installing ngrok library ... please wait! it's one time install ...",
        "info"
      )
    );
    exec("npm install -g ngrok", (err, stdout, stderr) => {});
  }

  // auto detect the project type
  const appPath = process.cwd();
  let files = fs.readdirSync(`${appPath}`);
  if (files.includes("package.json")) {
    printMessages([
      createMessage(
        `Starting express project here with PORT:${options.port || 8081} ... `,
        "info"
      ),
      createMessage("Starting ngrok connect ...", "info"),
    ]);

    const url = await ngrok.connect();

    printMessage(createMessage(`Remote URL :${url} `, "succ"));
    process.exit(0);
  } else if (files.includes("composer")) {
    printMessage(createMessage(`Starting laravel project here `, "info"));
  } else {
    printMessage(
      createMessage(
        "This is not a laravel or expressjs project! exiting ...",
        "err"
      )
    );
    process.exit(0);
  }
};
