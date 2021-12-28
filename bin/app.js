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
    .action(require("../src/commands/app/create"));

  _app
    .command("serve")
    .alias("s")
    .description("Serve, test, and view your Salla Partners App.")
    .option("-p, --port <name>", "port to listen to")
    .option("-l, --local", "run it locally without ngrok")
    .action(require("../src/commands/app/serve"));

  _app
    .command("create-webhook")
    .description("Creates a new webhook events file.")
    .action(require("../src/commands/app/create-webhook"));

  _app
    .command("delete")
    .alias("d")
    .description("Delete your Salla Partners App locally and Remote .")
    .action(require("../src/commands/app/delete"));

  _app
    .command("list")
    .alias("l")
    .description("List your Salla Partners Apps .")
    .action(require("../src/commands/app/list"));
  _app.showSuggestionAfterError();

  _app
    .command("info")
    .alias("l")
    .description("Show detailed app information.")
    .action(require("../src/commands/app/info"));

  _app
    .command("publish")
    .alias("l")
    .description("Publish your app to salla .")
    .action(require("../src/commands/app/publish"));

  _app.showSuggestionAfterError();

  return _app;
};
