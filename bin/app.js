

const commander = require("commander");
const program = new commander.Command();

module.exports = function appCommands() {
    const create = require("../lib/app/create");
    /*******************************************/
    const _app = program.command("app");
    // $ salla app create
    // $ salla app c
    _app
        .command("create")
        .alias("c") // alternative sub-command is `al`
        .description("Create new app")
        .action(function () {
            create();
        });

    return _app;
}