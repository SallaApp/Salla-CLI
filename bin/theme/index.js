
const commander = require("commander");
const program = new commander.Command();
const { checkNodeVersion, printCliResultErrorAndExit } = require('../../lib/cliCommon');


module.exports = function themeCommands() {
    const SallaThemeStart = require("../../lib/theme/start");
   
    const auth = require("../../lib/theme/auth");
    const push = require("../../lib/theme/push");
    const publish = require("../../lib/theme/publish");
    const watch = require("../../lib/theme/watch");
    /*******************************************/

    const _theme = program.command("theme");

    // $ salla theme start
    // $ salla theme s
    _theme
        .command("start")
        .alias("s")
        .description("Start new salla theme")
        .action(function () {
            
            checkNodeVersion()
            new SallaThemeStart().run({}).catch(printCliResultErrorAndExit);
        });

    // $ salla theme auth
    // $ salla theme a
    _theme
        .command("auth")
        .alias("a")
        .description("Check if the Salla access token exists")
        .action(function () {
            auth();
        });

    // $ salla theme watch
    // $ salla theme p
    _theme
        .command("watch")
        .alias("w")
        .description("Watch Salla theme")
        .action(function () {
            watch();
        });

    // $ salla theme publish
    // $ salla theme p
    _theme
        .command("publish")
        .alias("p")
        .description("publish Salla theme")
        .action(function () {
            publish();
        });

    // $ salla theme push
    // $ salla theme push
    _theme
        .command("push")
        .description("Push Salla theme")
        .action(function () {
            push();
        });
    return _theme;
}
