const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  return program
    .command("login")
    .alias("l")
    .description("🛑 Oops! Unable to authinticate. Try loggin again to Salla by running the following command: salla login")
    .action(require("../src/login"));
};
