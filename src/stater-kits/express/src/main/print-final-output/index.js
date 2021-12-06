const Logger = require("../../../../../utils/LoggingManager");

module.exports = ({ msgs, app_name, app_path }) => {
  Logger.longLine();
  // print other messages from commands
  Logger.printMessages(msgs);

  Logger.succ(`Whoop! ${app_name} is created With No Errors .`);
  
};
