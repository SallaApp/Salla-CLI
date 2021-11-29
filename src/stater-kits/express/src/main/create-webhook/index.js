const fs = require("fs-extra");
const path = require("path");
const Logger = require("../../../../../utils/LoggingManager");

module.exports = async function (options) {
  const app_name = "./";
  const webhook = process.argv[3];
  if (!webhook || webhook.split(".").length == 1) {
    Logger.error("Please enter a vaild webhook ex : app.installed ");
    process.exit(1);
  }
  if (!app_name) {
    Logger.error("Please enter your project name .");
    Logger.info("Usage  : salla create-webhook {event.name}");

    process.exit(1);
  }
  if (!webhook) {
    Logger.error("Please enter the webhook you want to create ");
    Logger.info("Usage  : salla create-webhook {event.name}");

    process.exit(1);
  }

  try {
    let webhook_splited = webhook.split(".");
    let folder = webhook_splited.shift();
    let webhook_file = webhook_splited.join(".");

    if (
      fs.existsSync(
        path.resolve(`./${app_name}/Actions/${folder}/${webhook_file}.js`)
      )
    ) {
      Logger.error("Please enter the webhook you want to create ");

      process.exit(1);
    }
    let webhook_template = fs
      .readFileSync(__dirname + "/templates/event.template.js")
      .toString();

    await fs.outputFile(
      path.resolve(`./${app_name}/Actions/${folder}/${webhook_file}.js`),
      webhook_template.split("${event.name}").join(folder + "." + webhook_file)
    );
    Logger.succ(
      `webhook created successfully  ${path.resolve(
        `./${app_name}/Actions/${folder}/${webhook_file}.js`
      )}`
    );
  } catch (err) {
    console.log("err", err);
    Logger.error("Error when creating webhook ");
  }

  process.on("unhandledRejection", function (err) {
    Logger.error("Error when creating webhook ");
  });
};
