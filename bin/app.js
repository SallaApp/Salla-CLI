const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  /*******************************************/
  const _app = program.command("app");
  // $ salla app create
  // $ salla app c

  require("../src/helpers/print-head")(_app);
  _app
    .command("create")
    .alias("c")
    .description(" app create  -n ProjectName ")
    .option("-n, --name <name>", "name of project ")
    .action(require("../src/app/create"));

  _app
    .command("serve")
    .alias("s")
    .option("-p, --port <name>", "port to listen to ")
    .action(require("../src/app/serve"));

  _app.command("login").alias("l").action(require("../src/app/login"));
  return _app;
};
