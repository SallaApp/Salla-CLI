const { exit } = require("process");
const fs = require("fs-extra");
const path = require("path");
const message = require("../../../../../helpers/message");
module.exports = async function (options) {
  const app_name = "./";
  const webhook = process.argv[3];
  if (!webhook || webhook.split(".").length == 1) {
    message.printMessage(
      message.createMessage(
        "Please enter a vaild webhook ex : app.installed ",
        "err"
      )
    );
    exit(0);
  }
  if (!app_name) {
    message.printMessages([
      message.createMessage("Please enter your project name .", "err"),
      message.createMessage(
        "Usage  : salla create-webhook {event.name}",
        "info"
      ),
    ]);

    exit(0);
  }
  if (!webhook) {
    message.printMessages([
      message.createMessage(
        "Please enter the webhook you want to create ",
        "err"
      ),
      message.createMessage(
        "Usage  : salla create-webhook {event.name}",
        "info"
      ),
    ]);

    exit(0);
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
      message.printMessage(
        message.createMessage(
          "Please enter the webhook you want to create ",
          "err"
        )
      );

      exit(0);
    }
    let webhook_template = fs
      .readFileSync(__dirname + "/templates/event.template.js")
      .toString();

    await fs.outputFile(
      path.resolve(`./${app_name}/Actions/${folder}/${webhook_file}.js`),
      webhook_template.split("${event.name}").join(folder + "." + webhook_file)
    );
    message.printMessage(
      message.createMessage(
        `webhook created successfully  ${path.resolve(
          `./${app_name}/Actions/${folder}/${webhook_file}.js`
        )}`,
        "succ"
      )
    );
  } catch (err) {
    console.log("err", err);
    message.printMessage(
      message.createMessage("Error when creating webhook ", "err")
    );
  }

  process.on("unhandledRejection", function (err) {
    message.printMessage(
      message.createMessage("Error when creating webhook ", "err")
    );
  });
};
