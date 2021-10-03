const inquirerModule = require("inquirer");
const SallaConfigManager = require("./SallaConfigManager");

class SallaThemeWatch {
  /**
   * @param inquirer
   * @param SallaConfigManager
   * @param logger
   */
  constructor({
    inquirer = inquirerModule,
    sallaConfigManager = new SallaConfigManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._sallaConfigManager = sallaConfigManager;
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