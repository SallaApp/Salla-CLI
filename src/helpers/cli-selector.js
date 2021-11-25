const cliSelect = require("cli-select");
const chalk = require("chalk");
module.exports = async (title, ary) => {
  console.log("                    ");
  console.log(title);
  let val = await cliSelect({
    values: ary,
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.bold(value);
      }
      return value;
    },
  });
  console.log(val.value);
  return val;
};
