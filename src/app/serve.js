const cliSelect = require("cli-select");
const commandExistsSync = require("command-exists").sync;
const { exec, spawn } = require("child_process");
const ngrok = require("ngrok");

// export function to Salla-cli
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
    console.log("Installing ngrok library ... please wait! ...");

    exec("npm install -g ngrok", (err, stdout, stderr) => {});
  }
  let framework = await cliSelect({
    values: ["express", "laravel"],
  });

  framework = framework.value;
  if (framework === "express") {
    console.log("starting express project here with port ", options.port);
    console.log("starting ngrok connect ...");
    const url = await ngrok.connect();
    console.log("Remote URL : ", url);
    process.exit(0);
  } else if (type === "laravel") {
    console.log("starting laravel project here ");
  } else {
    console.log("Invalid app type!! , please select express or laravel");
  }
};
