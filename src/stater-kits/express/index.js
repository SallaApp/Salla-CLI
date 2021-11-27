// import deps

const fs = require("fs");
const clc = require("cli-color");
const InputSelector = require("../../helpers/cli-selector");
const {
  printMessages,
  longLine,
  createMessage,
} = require("../../helpers/message");

// import EpxressJS commands Executor
const Executor = require("./src/main/create-project");

// set constants for the project
const SRC_TEMPLATE = __dirname + "/src/template";
const HOME_DIR_PROJECTS = process.cwd() + "/";
const DATABASE_ORM = ["Sequelize", "Mongoose", "TypeORM"];

// print salla head text
require("../../helpers/print-head")(null);

// export the module
module.exports.expressAppCreateor = async (options) => {
  let inputs = {};
  let database_orm = "";

  // check if the name of the project is provided
  if (options.app_name.indexOf("Create New App") > -1) {
    // if new project we ask for client_id,client_seceret etc ...
    inputs = await require("./src/main/user-inputs").inputs({
      ...options,
      HOME_DIR_PROJECTS,
    });
  } else {
    if (fs.existsSync(`${HOME_DIR_PROJECTS}/${options.app_name}`)) {
      printMessages(
        createMessage(
          `App name "${HOME_DIR_PROJECTS}${options.app_name}" already exists! ..  exiting setup .`,
          "err"
        )
      );

      process.exit(0);
    }

    database_orm = (await InputSelector("App Database ORM: ", DATABASE_ORM))
      .value;
  }

  // start executing the process
  Executor({
    src: `${SRC_TEMPLATE}`,
    database_orm,
    ...inputs,
    app_path: HOME_DIR_PROJECTS + (inputs.app_name || options.app_name),
  })
    .then((msgs) => {
      if (msgs.filter((msg) => msg.type === "err").length > 0) {
        printMessages([
          ...msgs,
          createMessage(`Error! while creating your project .`, "err"),
        ]);
      } else {
        require("./src/main/print-final-output")({
          msgs: msgs || [],
          app_name: inputs.app_name || options.app_name,
          app_path: HOME_DIR_PROJECTS + (inputs.app_name || options.app_name),
        });
      }
    })
    .catch((msgs) => {
      longLine();

      printMessages(
        createMessage(`Error! while creating your project .`, "err")
      );
    });
};

// If Error occurs while creating the project
process.on("unhandledRejection", function (err) {
  longLine();
  console.log(err);
  printMessages(
    createMessage(`Error! while creating your project .`, "err", err)
  );
  process.exit(0);
});
