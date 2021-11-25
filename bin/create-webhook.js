const commander = require("commander");
const program = new commander.Command();

module.exports = function createWebhookCommands() {
  const _app = program.command("create-webhook");
  return _app
    .command("create-webhook")
    .alias("l")
    .description(" create webhook action file ")
    .action(require("../src/app/create-webhook"));
};
