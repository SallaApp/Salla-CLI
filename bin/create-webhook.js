const commander = require("commander");
const program = new commander.Command();

module.exports = function createWebhookCommands() {
  const _app = program.command("create-webhook");
  return _app
    .command("create-webhook")
    .alias("l")
    .description("Webhook on the way, Please Wait...")
    .action(require("../src/app/create-webhook"));
};


