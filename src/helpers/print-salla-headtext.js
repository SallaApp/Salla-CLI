const clc = require("cli-color");
const chalkAnimation = require("chalk-animation");
const Logger = require("../utils/LoggingManager");
module.exports = async (program, version) => {
  let sallaText = `
    _____       _ _          _____ _      _____ 
   / ____|     | | |        / ____| |    |_   _|
  | (___   __ _| | | __ _  | |    | |      | |  
   \\___ \\ / _\` | | |/ _\` | | |    | |      | |  
   ____) | (_| | | | (_| | | |____| |____ _| |_ 
  |_____/ \\__,_|_|_|\\__,_|  \\_____|______|_____|
`;

  if (!program) {
    console.log(clc.greenBright(sallaText));
  } else {
    program.addHelpText("before", sallaText.green);
  }
  console.log(clc.greenBright("                  Version: " + version));
  return new Promise((resolve) => {
    const textAnimated = chalkAnimation.rainbow(
      "    The Official Salla Command Line Interface"
    );
    textAnimated.start();

    setTimeout(() => {
      Logger.longLine();
      Logger.info("Read the docs: https://github.com/SallaApp/Salla-CLI/ ");
      Logger.info(
        "Support and bugs: https://github.com/SallaApp/Salla-CLI/issues "
      );

      Logger.longLine();
      textAnimated.stop();
      resolve();
    }, 1000);
  });
};
