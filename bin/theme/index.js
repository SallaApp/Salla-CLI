const commander = require("commander");
const program = new commander.Command();
const {printCliResultErrorAndExit} = require('../../lib/cliCommon');


module.exports = function themeCommands() {
    const Start = require("../../lib/theme/start");
    const Auth = require("../../lib/theme/auth");
    const Serve = require("../../lib/theme/serve");
    const Watch = require("../../lib/theme/watch");
    const Sync = require("../../lib/theme/sync");
    const Push = require("../../lib/theme/push");
    const publish = require("../../lib/theme/publish");
    /*******************************************/

    const themeCommand = program.command("theme");

    themeCommand
        .command("start")
        .alias("s")
        .option('-n,--name <theme_name>', 'Theme name')
        .description("Start new salla theme")
        .action(options => new Start(options, 'start').run().catch(printCliResultErrorAndExit));


    themeCommand
        .command("auth", {hidden: true})
        .alias("a")
        .description("Check if the tokens existed and valid")
        .option('-f,--force', 'Force get new tokens')
        .option('-p,--port <port>', 'Authentication socket port')
        .action(options => new Auth(options, 'auth').run().catch(printCliResultErrorAndExit));

    themeCommand
        .command("serve", {hidden: true})
        .description("Create Local sever")
        .option('-p,--port <port>', 'Assets port')
        .action((options) => new Serve(options, 'serve').run().catch(printCliResultErrorAndExit));

    themeCommand
        .command("sync", {hidden: true})
        .requiredOption('-f,--file <file_path>', 'File Path')
        .requiredOption('-t,--theme_id <theme_id>', 'Theme Id')
        .description("Upload modified file for testing theme.")
        .action(options => new Sync(options, 'sync').run().catch(printCliResultErrorAndExit));

    themeCommand
        .command("watch")
        .alias("w")
        .option('-p,--port <port>', 'assets port')
        .option('-s,--skip-start', 'skip start')
        .description("Watch Salla theme")
        .action(options => new Watch(options, 'watch').run().catch(printCliResultErrorAndExit));

    themeCommand
        .command("push")
        .description("Push Salla theme")
        .option('-f,--force', 'Force push all files, not only twig files.')
        .option('-t,--token <github_token>', 'Github token')
        .option('-n,--name <github_name>', 'Github user name')
        .option('-i,--minor', 'Is release minor')
        .option('-m,--message <message>', 'commit message')
        .action(options => new Push(options, 'push').run().catch(printCliResultErrorAndExit));

    themeCommand
        .command("publish")
        .alias("p")
        .description("publish Salla theme")
        .action(options => new publish(options, 'publish').run().catch(printCliResultErrorAndExit));

    return themeCommand;
}
