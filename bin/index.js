#!/usr/bin/env node

//this to avoid local https errors, it cause problems locally
require('https').globalAgent.options.rejectUnauthorized = false;

require('../constants');
const Dev = require('../lib/dev');
const commander = require("commander");
const program = new commander.Command();
program.version('0.0.2');

const themeCommands = require("./theme");
const appCommands = require("./app");
const devCommands = require("./dev");


program.addCommand(themeCommands());
program.addCommand(appCommands());
program.addCommand(devCommands());
program.parse(process.argv);