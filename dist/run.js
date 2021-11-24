var shell = require("shelljs");
var opsys = process.platform;
if (opsys === "darwin") {
  opsys = "macos";
} else if (opsys === "win32" || opsys === "win64") {
  opsys = "win.exe";
} else if (opsys === "linux") {
  opsys = "linux";
}
var myArgs = process.argv.slice(2);
shell.exec("./salla-" + opsys + " " + myArgs.join(" "));
