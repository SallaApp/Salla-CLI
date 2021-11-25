const fs = require("fs");
module.exports = function (path) {
  let folders = fs.readdirSync(path || process.cwd());
  // TODO : check if express or laravel
  if (folders.includes("package.json")) return "express";
  if (folders.includes("composer")) return "laravel";
};
