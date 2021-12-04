// import deps

const Logger = require("../../utils/LoggingManager");

//Logger.setInstantPrint(true);

// import EpxressJS commands Executor
const Executor = require("./src/main/create-project");

const PrintFinalOutput = require("./src/main/print-final-output");

// set constants for the project
const SRC_TEMPLATE = __dirname + "/src/template";

// export the module
module.exports.ExpressAppCreateor = async (options) => {
  // start executing the process
  return Executor({
    src: `${SRC_TEMPLATE}`,
    ...options,
    app_path: options.app_path,
  })
    .then((msgs) => {
      if (msgs.filter((msg) => msg.type === "err").length > 0) {
        Logger.printMessages([
          ...msgs,
          Logger.createMessage(`Error! while creating your project .`, "err"),
        ]);
      } else {
        PrintFinalOutput({
          msgs: msgs || [],
          ...options,
          app_path: options.app_path,
        });
      }
      return {
        msgs: msgs || [],
        ...options,
        app_path: options.app_path,
      };
    })
    .catch((msgs) => {
      Logger.longLine();
      Logger.error(`Error! while creating your project .`);
    });
};

// If Error occurs while creating the project
process.on("unhandledRejection", function (err) {
  Logger.longLine();
  Logger.normal(err);

  Logger.error(`Error! while creating your project .`);
  process.exit(0);
});
