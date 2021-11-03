const commander = require("commander");

module.exports = function DevCommands() {
    const Dev = require("../lib/dev");

    return (new commander.Command()).command("dev", {hidden: true})
        .requiredOption('-b,--base <working_base>', 'Changing the base url for all endpoints.')
        .description("Commands For Internal Team")
        .action(options => new Dev(options, 'dev').run());
}
