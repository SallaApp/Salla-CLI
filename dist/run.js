const shell = require("shelljs");
let opsys = process.platform;
const path = require("path");
if (opsys === "darwin") {
  opsys = "macos";
} else if (opsys === "win32" || opsys === "win64") {
  opsys = "win.exe";
} else if (opsys === "linux") {
  opsys = "linux";
}
var myArgs = process.argv.slice(2);
shell.exec(path.resolve("./salla-" + opsys + " " + myArgs.join(" ")));
