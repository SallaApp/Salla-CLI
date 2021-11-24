const cliProgress = require("cli-progress");
const fs = require("fs");
const { exit } = require("process");
const clc = require("cli-color");
const SRC_TEMPLATE = __dirname + "/src/template";
const Executor = require("./src/main/create-project");
require("./src/main/print-salla-head-text");
const homedir = require("./src/helpers/home.dir");
const HOME_DIR_PROJECTS = homedir() + "/SallaApps/";
const DATABASE_ORM = ["Sequelize", "Mongoose", "TypeORM"];
const readlineSync = require("readline-sync");

if (!fs.existsSync(HOME_DIR_PROJECTS)) {
  fs.mkdirSync(HOME_DIR_PROJECTS);
}
const { printMessages } = require("./src/helpers/message");
const longLine = () => console.log("                    ");
// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar(
  {
    format: " {process} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_grey
);

process.on("unhandledRejection", function (err) {
  longLine();
  printMessages(err);
  longLine();
  console.log(
    clc.redBright("[x]  Error! while creating your project .  "),
    err
  );
  exit(0);
});

// todo :: run the create express project
module.exports.expressAppCreateor = (options) => {
  let inputs = {};
  let database_orm = "";
  if (options.app_name == "Create New App ?") {
    inputs = require("./src/main/user-inputs").inputs({
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
      exit(0);
    }
    database_orm =
      DATABASE_ORM[
        readlineSync.keyInSelect(DATABASE_ORM, "App Database ORM: ")
      ];
  }

  Executor.setPrameters({
    progressBar,
    src: `${SRC_TEMPLATE}`,
    database_orm,
    ...inputs,
    app_path: HOME_DIR_PROJECTS + (inputs.app_name || options.app_name),
  });
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
