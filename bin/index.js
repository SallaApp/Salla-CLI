#!/usr/bin/env node

//this to avoid local https errors, it cause problems locally
require('https').globalAgent.options.rejectUnauthorized = false;

require('../constants');
const Dev = require('../src/dev');
const commander = require("commander");
const program = new commander.Command();
program.version('0.0.2');

program.addHelpText('before', `
  _____       _ _          _____ _      _____ 
 / ____|     | | |        / ____| |    |_   _|
| (___   __ _| | | __ _  | |    | |      | |  
 \\___ \\ / _\` | | |/ _\` | | |    | |      | |  
 ____) | (_| | | | (_| | | |____| |____ _| |_ 
|_____/ \\__,_|_|_|\\__,_|  \\_____|______|_____|
`.green);

const themeCommands = require("./theme");
const appCommands = require("./app");
const devCommands = require("./dev");


program.addCommand(themeCommands());
program.addCommand(appCommands());
program.addCommand(devCommands());
program.parse(process.argv);