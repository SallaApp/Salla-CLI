const clc = require("cli-color");
const messageFactory = require("../../helpers/message");
module.exports = ({ msgs, app_name }) => {
  console.log("                    ");
  // print other messages from commands
  messageFactory.printMessages(msgs);
  console.log("                    ");
  console.log(clc.greenBright("[✓] Done With No Errors . "));
  console.log("                    ");
  console.log("To start execute the follwing  :");
  console.log("                    ");
  console.log(
    clc.greenBright(
      `                    [✓] cd ${app_name} && npm install && npm run start-app                    `
    )
  );
  console.log("                    ");

  console.log("As always, happy hacking! 🙌");
};
