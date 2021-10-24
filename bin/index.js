#!/usr/bin/env node

//this to avoid local https errors, it cause problems locally
require('https').globalAgent.options.rejectUnauthorized = false;
const commander = require("commander");
const program = new commander.Command();

const themeCommands = require("./theme/index");
const appCommands = require("./app/index");


program.addCommand(themeCommands());
program.addCommand(appCommands());

program.parse(process.argv);