const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  /*******************************************/
  const _app = program
    .command("app")
    .description("✨ Start building your New Salla Partners App");
  // $ salla app create
  // $ salla app c

  _app
    .command("create")

    .description(
      "✅ Create a new Salla application using the Salla CLI in this manner: salla app create."
    )
    .action(require("../src/app/create"));

  _app
    .command("serve")
    .alias("s")
    .description(
      "ℹ️  Serve your Salla application using the Salla CLI in this manner: salla app serve."
    )
    .option("-p, --port <name>", "port to listen to")
    .action(require("../src/app/serve"));

  _app
    .command("create-webhook")
    .description("✨ Creating a new webhook event file.")
    .action(require("../src/app/create-webhook"));

  _app.showSuggestionAfterError();
  return _app;
};