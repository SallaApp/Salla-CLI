
const commander = require("commander");
const program = new commander.Command();
const { checkNodeVersion, printCliResultErrorAndExit } = require('../../lib/cliCommon');


module.exports = function themeCommands() {
    const ThemeStart = require("../../lib/theme/start");
    const ThemeAuth = require("../../lib/theme/auth");
    const ThemeWatch = require("../../lib/theme/watch");
    const ThemePush = require("../../lib/theme/push");
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
            new ThemeStart().run({}).catch(printCliResultErrorAndExit);
        });

    // $ salla theme auth
    // $ salla theme a
    _theme
        .command("auth")
        .alias("a")
        .description("Check if the Salla access token exists")
        .action(function () {
            new ThemeAuth().run({}).catch(printCliResultErrorAndExit);
        });

    // $ salla theme watch
    // $ salla theme w
    _theme
        .command("watch")
        .alias("w")
        .option('-s,--skip-start', 'skip start')
        .option('-s,--test', 'just test')
        .description("Watch Salla theme")
        .action((options) => {
            new ThemeWatch().run(options).catch(printCliResultErrorAndExit);
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
        .action((options) => {
            new ThemePush().run(options).catch(printCliResultErrorAndExit);
        });

    return _theme;
}
