const inquirerModule = require("inquirer");
const {
  execSync
} = require('child_process')
const ConfManager = require("./utils/ConfigManager");
const {
  PACKAGE_INFO
} = require("../../constants");

class ThemeWatch {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
    this._logger = logger;
  }


  async run(cliOptions = {}) {

    if (cliOptions.skipStart) {
      console.log("watch with --skip-start")
      // TODO :: check the type of package manager in OS (npm/yarn)
      // check if watch defined in package.json
      if (PACKAGE_INFO.scripts.hasOwnProperty("watch")) {
        execSync(
          'npm run watch', {
            stdio: 'inherit'
          }
        );
      } else {
        console.log("There is no watch script".red);
      }
    } else {
      execSync(
        'salla theme start', {
          stdio: 'inherit'
        }
      );
    }
  }
}

module.exports = ThemeWatch