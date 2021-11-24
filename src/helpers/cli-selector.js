const cliSelect = require("cli-select");
const chalk = require("chalk");
module.exports = (title, ary) => {
  console.log(title);
  return cliSelect({
    values: ary,
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.bold(value);
      }
      return value;
    },
  });
};
