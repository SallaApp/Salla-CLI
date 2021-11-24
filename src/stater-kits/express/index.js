const cliProgress = require("cli-progress");
const { exit } = require("process");
const clc = require("cli-color");
const SRC_TEMPLATE = __dirname + "/src/template";
const Executor = require("./src/main/create-project");
require("./src/main/print-salla-head-text");

const { printMessages } = require("./src/helpers/message");

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar(
  {
    format: " {process} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_grey
);

process.on("unhandledRejection", function (err) {
  console.log("                    ");
  console.log("                    ");
  printMessages(err);
  console.log("                    ");
  console.log(
    clc.redBright("[x]  Error! while creating your project .  "),
    err
  );
  exit(0);
});

// todo :: run the create express project
module.exports.expressAppCreateor = (options) => {
  const inputs = require("./src/main/user-inputs").inputs(options);

  Executor.setPrameters({
    progressBar,
    src: `${SRC_TEMPLATE}`,
    ...inputs,
  });
  Executor.execute()
    .then((msgs) => {
      require("./src/main/print-final-output")({
        msgs: msgs || [],
        app_name: inputs.app_name,
      });
    })
    .catch((err) => {
      console.log("                    ");
      console.log("                    ");
      printMessages(err);
      console.log("                    ");
      console.log(clc.redBright("[x]  Error! while creating your project . "));
    });
};
