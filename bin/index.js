#!/usr/bin/env node

//this to avoid local https errors, it cause problems locally
require("https").globalAgent.options.rejectUnauthorized = false;
const fs = require("fs");
require("../constants");

const commander = require("commander");
const program = new commander.Command();
program.name("salla").usage("[command]");
const packageJSON = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`));
(async () => {
  if (!process.argv.includes("--nohead")) {
    // print salla head text
    await require("../src/helpers/print-salla-headtext")(
      null,
      packageJSON.version
    );
  } else {
    process.argv.splice(process.argv.indexOf("--nohead"), 1);
  }

  program.version(packageJSON.version);

  const themeCommands = require("./theme");
  const appCommands = require("./app");
  const loginCommands = require("./login");
  const devCommands = require("./dev");
  program.addCommand(appCommands());
  program.addCommand(loginCommands());
  program.addCommand(themeCommands());

  program.addCommand(devCommands());
  program.configureHelp({
    sortSubcommands: false,

    subcommandTerm: (cmd) => cmd.name(), // Just show the name, instead of short usage.
  });
  program.parse(process.argv);
})();
