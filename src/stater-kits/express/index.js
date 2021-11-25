// import deps
const cliProgress = require("cli-progress");
const fs = require("fs");
const clc = require("cli-color");
const InputSelector = require("../../helpers/cli-selector");
const { printMessages, longLine } = require("../../helpers/message");

// import EpxressJS commands Executor
const Executor = require("./src/main/create-project");

// set constants for the project
const SRC_TEMPLATE = __dirname + "/src/template";
const HOME_DIR_PROJECTS = process.cwd() + "/";
const DATABASE_ORM = ["Sequelize", "Mongoose", "TypeORM"];

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar(
  {
    format: " {process} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_grey
);

// export the module
module.exports.expressAppCreateor = async (options) => {
  let inputs = {};
  let database_orm = "";

  // print salla head text
  require("../../helpers/print-head")(null);

  // check if the name of the project is provided
  if (options.app_name.indexOf("Create New App") > -1) {
    // if new project we ask for client_id,client_seceret etc ...
    inputs = await require("./src/main/user-inputs").inputs({
      ...options,
      HOME_DIR_PROJECTS,
    });
  } else {
    if (fs.existsSync(`${HOME_DIR_PROJECTS}/${options.app_name}`)) {
      console.log(
        clc.redBright(
          `[x] App name "${HOME_DIR_PROJECTS}${options.app_name}" already exists! ..  exiting setup .`
        )
      );
      process.exit(0);
    }

    database_orm = (await InputSelector("App Database ORM: ", DATABASE_ORM))
      .value;
  }
  // set inputs and parameters before exeute the creation process
  Executor.setPrameters({
    progressBar,
    src: `${SRC_TEMPLATE}`,
    database_orm,
    ...inputs,
    app_path: HOME_DIR_PROJECTS + (inputs.app_name || options.app_name),
  });

  // start executing the process
  Executor.execute()
    .then((msgs) => {
      require("./src/main/print-final-output")({
        msgs: msgs || [],
        app_name: inputs.app_name || options.app_name,
        app_path: HOME_DIR_PROJECTS + (inputs.app_name || options.app_name),
      });
    })
    .catch((err) => {
      longLine();
      longLine();
      printMessages(err);
      longLine();
      console.log(clc.redBright("[x]  Error! while creating your project . "));
    });
};

// If Error occurs while creating the project
process.on("unhandledRejection", function (err) {
  longLine();
  printMessages(err);
  longLine();
  console.log(
    clc.redBright("[x]  Error! while creating your project .  "),
    err
  );
  process.exit(0);
});
