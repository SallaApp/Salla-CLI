const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  return program
    .command("login")

    .description("Login to your salla partner account")
    .action(require("../src/login"));
};
