const chokidar = require('chokidar');


const path = require('path');
const ROOT = process.cwd();
const fs = require("fs");



module.exports = function () {
 // One-liner for current directory
 chokidar.watch('example',{
  persistent: true
}).on('all', (event, path) => {

  console.log(event, path);
}); 
  

  console.log('------------------');
  console.log('theme Watch TODO');
  console.log('------------------');
};