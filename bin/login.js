const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  return program
    .command("login")

    .description("Login to your Salla Partners account")
    .action(require("../src/commands/login/login"));
};
