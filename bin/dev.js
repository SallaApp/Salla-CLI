const commander = require("commander");

module.exports = function DevCommands() {
  const Dev = require("../src/commands/dev/dev");

  return new commander.Command()
    .command("dev", {
      hidden: true,
    })
    .option(
      "-b,--base <working_base>",
      "Changing the base url for all endpoints ..."
    )
    .option("-c,--config", "Show config file.")
    .description("💻 Development Command for the Internal team.")
    .action((options) => new Dev(options, "dev").run());
};
