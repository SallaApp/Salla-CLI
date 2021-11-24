const clc = require("cli-color");
const { exit } = require("process");
const fs = require("fs-extra");
const path = require("path");

const app_name = process.argv[2];
const webhook = process.argv[3];
if (!app_name) {
  console.log(clc.red("[✕]  Please enter your project name . "));
  console.log("                    ");
  console.log(
    clc.blueBright(
      `[!] Useing : npm run create-webhook YOUR_APP_NAME {event-name} `
    )
  );
  exit(0);
}
if (!webhook) {
  console.log(clc.red("[✕]  Please enter the webhook you want to create "));
  console.log("                    ");
  console.log(
    clc.blueBright(
      `[!] Useing : npm run create-webhook YOUR_APP_NAME {event-name} `
    )
  );
  exit(0);
}
(async () => {
  try {
    let webhook_splited = webhook.split(".");
    let folder = webhook_splited.shift();
    let webhook_file = webhook_splited.join(".");

    if (
      fs.existsSync(
        path.resolve(`./${app_name}/Actions/${folder}/${webhook_file}.js`)
      )
    ) {
      console.log(clc.red("[✕]  Webhook already exists "));
      exit(0);
    }
    let webhook_template = fs
      .readFileSync(__dirname + "/templates/event.template.js")
      .toString();

    await fs.outputFile(
      path.resolve(`./${app_name}/Actions/${folder}/${webhook_file}.js`),
      webhook_template.split("${event-name}").join(folder + "." + webhook_file)
    );
    console.log(
      clc.greenBright(
        `[✓] webhook created successfully  ${path.resolve(
          `./${app_name}/Actions/${folder}/${webhook_file}.js`
        )}      `
      )
    );
  } catch (err) {
    console.log(clc.red("[✕]  Error when creating webhook", err));
  }
})();

process.on("unhandledRejection", function (err) {
  console.log("                    ");
  console.log(clc.red("[✕]  Error! while creating your webhook . "), err);
});
