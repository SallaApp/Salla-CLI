var shell = require('shelljs');
var myArgs = process.argv.slice(2);
shell.exec('composer create-project salla/laravel-starter-kit ' + myArgs.join(' '));