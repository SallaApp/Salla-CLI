const inquirerModule = require("inquirer");
const ConfigManager = require("./ConfigManager");

class SallaThemeWatch {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfigManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
    this._logger = logger;
  }


  async run(cliOptions = {}) {

    // TODO :: check if watch defined in package.json

    require('child_process').execSync(
        'npm run watch',
        {stdio: 'inherit'}
    );
  }
}

module.exports = SallaThemeWatch