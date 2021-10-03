#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command();

const themeCommands = require("./theme/index");
const appCommands = require("./app/index");



program.addCommand(themeCommands());
program.addCommand(appCommands());

program.parse(process.argv);