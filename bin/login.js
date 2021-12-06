const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  return program
    .command("login")
    .alias("l")
    .description("Please, login to Salla")
    .action(require("../src/login"));
};
