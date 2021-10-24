const commander = require("commander");
const program = new commander.Command();
const {checkNodeVersion, printCliResultErrorAndExit} = require('../../lib/cliCommon');


module.exports = function themeCommands() {
    const ThemeStart = require("../../lib/theme/start");
    const ThemeAuth = require("../../lib/theme/auth");
    const ThemeWatch = require("../../lib/theme/watch");
    const ThemeSync = require("../../lib/theme/sync");
    const ThemePush = require("../../lib/theme/push");
    const publish = require("../../lib/theme/publish");
    /*******************************************/

    const themeCommand = program.command("theme");

    themeCommand
        .command("start")
        .alias("s")
        .description("Start new salla theme")
        .action(function () {
            checkNodeVersion()
            new ThemeStart().run({}).catch(printCliResultErrorAndExit);
        });


    themeCommand
        .command("auth", {hidden: true})
        .alias("a")
        .description("Check if the tokens existed and valid")
        .option('-f,--force', 'Force get new tokens')
        .action((options) => new ThemeAuth().run(options).catch(printCliResultErrorAndExit));

    themeCommand
        .command("sync")
        .requiredOption('-f,--file <file_path>', 'File Path')
        .requiredOption('-t,--theme_id <theme_id>', 'Theme Id')
        .description("Upload modified file for testing theme.")
        .action(options => new ThemeSync().run(options).catch(printCliResultErrorAndExit));

    themeCommand
        .command("watch")
        .alias("w")
        .option('-s,--skip-start', 'skip start')
        .description("Watch Salla theme")
        .action(options => new ThemeWatch().run(options).catch(printCliResultErrorAndExit));

    themeCommand
        .command("publish")
        .alias("p")
        .description("publish Salla theme")
        .action(() => new publish());

    themeCommand
        .command("push")
        .description("Push Salla theme")
        .option('-s,--soft', 'soft pushing')
        .option('-t,--token <github_token>', 'Github token')
        .option('-n,--name <github_name>', 'Github user name')
        .action((options) => new ThemePush().run(options).catch(printCliResultErrorAndExit));

    return themeCommand;
}
