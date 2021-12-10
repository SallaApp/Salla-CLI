const clc = require("cli-color");
const chalkAnimation = require("chalk-animation");

module.exports = async (program) => {
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
  return new Promise((resolve) => {
    const textAnimated = chalkAnimation.rainbow(
      "     The Official Salla Command Line Interface"
    );
    textAnimated.start();

    setTimeout(() => {
      console.log("        ");
      console.log("Read the docs: https://github.com/SallaApp/Salla-CLI/ ");
      console.log(
        "Support and bugs: https://github.com/SallaApp/Salla-CLI/issues "
      );
      console.log("        ");
      textAnimated.stop();
      resolve();
    }, 1000);
  });
};
