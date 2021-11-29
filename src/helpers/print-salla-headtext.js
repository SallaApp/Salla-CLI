const clc = require("cli-color");
module.exports = (program) => {
  let sallaText = `
  _____       _ _          _____ _      _____ 
 / ____|     | | |        / ____| |    |_   _|
| (___   __ _| | | __ _  | |    | |      | |  
 \\___ \\ / _\` | | |/ _\` | | |    | |      | |  
 ____) | (_| | | | (_| | | |____| |____ _| |_ 
|_____/ \\__,_|_|_|\\__,_|  \\_____|______|_____|
`;
  if (!program) {
    return console.log(clc.green(sallaText));
  }
  program.addHelpText("before", sallaText.green);
};
