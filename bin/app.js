const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  /*******************************************/
  const _app = program
    .command("app")
    .description("Start building your New Salla Partners App");
  // $ salla app create
  // $ salla app c

  _app
    .command("create")

    .description(
      "Wizard to help you create a new Salla Partners App."
    )
    .action(require("../src/app/create"));

  _app
    .command("serve")
    .alias("s")
    .description(
      "Serve, test, and view your Salla Partners App."
    )
    .option("-p, --port <name>", "port to listen to")
    .action(require("../src/app/serve"));

  _app
    .command("create-webhook")
    .description("Creates a new webhook events file.")
    .action(require("../src/app/create-webhook"));

  _app.showSuggestionAfterError();
  return _app;
};
