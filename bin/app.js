const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  /*******************************************/
  const _app = program.command("app");
  // $ salla app create
  // $ salla app c

  _app
    .command("create")
    .alias("c")
    .description("Create a new Salla application using the Salla CLI in this manner: app create  -n <appname>")
    .option("-n, --name <name>", "name of project ")
    .action(require("../src/app/create"));

  _app
    .command("serve")
    .alias("s")
    .option("-p, --port <name>", "port to listen to ")
    .action(require("../src/app/serve"));

  _app
    .command("create-webhook")
    .alias("l")
    .description("Creating a new webhook event file.")
    .action(require("../src/app/create-webhook"));

  _app.showSuggestionAfterError();
  return _app;
};
