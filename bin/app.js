const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  /*******************************************/
  const _app = program.command("app");
  // $ salla app create
  // $ salla app c
  _app.addHelpText(
    "before",
    `
    Welcome to app creation wizard!
    
  `.green
  );
  _app
    .command("create")
    .alias("c") // alternative sub-command is `al`

    .description(" app create  -n ProjectName ")
    .requiredOption("-n, --name <name>", "name of project ")
    .action(require("../src/app/create"));

  _app
    .command("serve")
    .alias("c") // alternative sub-command is `al`
    .requiredOption("-n, --name <name>", "name of project ")
    .action(require("../src/app/serve"));
  return _app;
};
