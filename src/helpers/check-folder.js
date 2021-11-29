const fs = require("fs");
module.exports = function (path) {
  let folders = fs.readdirSync(path || process.cwd());
  //  Check if express or laravel
  if (folders.includes("artisan")) return "laravel";
  if (folders.includes("package.json")) return "express";
  return "unknown";
};
