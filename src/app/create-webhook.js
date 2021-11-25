const checkFolder = require("../helpers/check-folder");
const { printMessage, createMessage } = require("../helpers/message");

module.exports = async function (options) {
  // TODO : check if express or laravel
  if (checkFolder(process.cwd()) == "express") {
    require("../stater-kits/express/src/main/create-webhook")(options);
    return;
  }

  if (checkFolder(process.cwd()) == "laravel") {
    // here create webhook for laravel
    return;
  }

  printMessage(
    createMessage(
      "unknown project type .. please chose a vaild project ",
      "err"
    )
  );
};
