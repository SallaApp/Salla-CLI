const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
  return program
    .command("login")
    .alias("l")
    .description(" login to salla app ")
    .action(require("../src/login"));
};
