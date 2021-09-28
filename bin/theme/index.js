
const commander = require("commander");
const program = new commander.Command();
const { checkNodeVersion, printCliResultErrorAndExit } = require('../../lib/cliCommon');


module.exports = function themeCommands() {
    const SallaThemeStart = require("../../lib/theme/start");
    const SallaThemeAuth = require("../../lib/theme/auth");
    const SallaThemeWatch = require("../../lib/theme/watch");

    const push = require("../../lib/theme/push");
    const publish = require("../../lib/theme/publish");
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
            new SallaThemeAuth().run({}).catch(printCliResultErrorAndExit);
        });

    // $ salla theme watch
    // $ salla theme w
    _theme
        .command("watch")
        .alias("w")
        .option('-s,--skip-start', 'skip start')
        .description("Watch Salla theme")
        .action((options) => {
            new SallaThemeWatch().run(options).catch(printCliResultErrorAndExit);
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
        .option('-s,--soft', 'soft pushing')
        .action((options, command) => {
            if (options.soft) {
                console.error('Called %s with options %o', command.name(), options);
            }
     
           push();
        });
    return _theme;
}
