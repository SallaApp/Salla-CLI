const readlineSync = require("readline-sync");
module.exports = (title) => {
  console.log("                    ");
  return readlineSync.question(title);
};
