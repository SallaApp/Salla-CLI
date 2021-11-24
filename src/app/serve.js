const cliSelect = require("cli-select");
const chalk = require("chalk");

// export function to Salla-cli
module.exports = function (options) {
  // steps to create an app
  /*

  → salla app serve → check the type of project for current folder
          → laravel → php artisan serve run the app under port
        → express → node serve to un the app under the port
        → ngrok http {port}
        → update the web hook & redirect url in the app api
 submit the url hooks based on easy or hard modes ! 
  
  */

  cliSelect({
    values: ["express", "laravel"],
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.underline(value);
      }

      return value;
    },
  }).then((type) => {
    type = type.value;
    if (type === "express") {
      console.log("starting project here ");
    } else if (type === "laravel") {
    } else {
      console.log("Invalid app type!! , please select express or laravel");
    }
  });
  return;
};
