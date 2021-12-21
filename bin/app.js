const commander = require("commander");
const program = new commander.Command();
module.exports = function appCommands() {
  /*******************************************/
  const _app = program
    .command("app")
    .description("Start building your New Salla Partners App");

  _app
    .command("create")

    .description("Wizard to help you create a new Salla Partners App.")
    .action(require("../src/app/create"));

  _app
    .command("serve")
    .alias("s")
    .description("Serve, test, and view your Salla Partners App.")
    .option("-p, --port <name>", "port to listen to")
    .action(require("../src/app/serve"));

  _app
    .command("create-webhook")
    .description("Creates a new webhook events file.")
    .action(require("../src/app/create-webhook"));

  _app
    .command("delete")
    .alias("d")
    .option("-id, --id <app_id>", "app id to delete")
    .description("Delete your Salla Partners App locally and Remote .")
    .action(require("../src/app/delete"));

  _app
    .command("list")
    .alias("l")
    .description("List your Salla Partners Apps .")
    .action(require("../src/app/list"));
  _app.showSuggestionAfterError();

  _app
    .command("info")
    .alias("l")
    .description("Show detailed app information.")
    .action(require("../src/app/info"));
  _app.showSuggestionAfterError();

  return _app;
};
