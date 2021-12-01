#!/usr/bin/env node

//this to avoid local https errors, it cause problems locally
require("https").globalAgent.options.rejectUnauthorized = false;
const fs = require("fs");
require("../constants");
const Dev = require("../src/dev");
const commander = require("commander");
const program = new commander.Command();
if (!process.argv.includes("--nohead")) {
  // print salla head text
  require("../src/helpers/print-salla-headtext")(null);
} else {
  process.argv.splice(process.argv.indexOf("--nohead"), 1);
}
const packageJSON = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`));
program.version(packageJSON.version);
program.showSuggestionAfterError();
const themeCommands = require("./theme");
const appCommands = require("./app");
const loginCommands = require("./login");
const devCommands = require("./dev");
const createWebhook = require("./create-webhook");

program.addCommand(themeCommands());
program.addCommand(appCommands());
program.addCommand(loginCommands());
program.addCommand(devCommands());
program.addCommand(createWebhook());
program.parse(process.argv);
