const inquirerModule = require("inquirer");
const {
  execSync
} = require('child_process')
const ConfManager = require("./utils/ConfigManager");
const AuthenticationManager = require("./utils/AuthenticationManager");

class ThemeWatch {
  /**
   * @param inquirer
   * @param ConfigManager
   * @param logger
   * @param authManager
   */
  constructor({
    inquirer = inquirerModule,
    ConfigManager = new ConfManager(),
    AuthManager = new AuthenticationManager(),
    logger = console,
  } = {}) {
    this._inquirer = inquirer;
    this._ConfigManager = ConfigManager;
    this._AuthManager = AuthManager;
    this._logger = logger;
  }


  async run(cliOptions = {}) {
    //If the token file exist
    if (this._AuthManager.isExists()) {
      console.log("Auth file is exists")
      if (cliOptions.skipStart) {
        console.log("watch with --skip-start")
        // TODO :: check the type of package manager in OS (npm/yarn)
        // check if watch defined in package.json
        if (this.packageData().scripts.hasOwnProperty("watch")) {
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


    } else {
      // go to salla theme auth
      console.log("not exists")
      execSync(
        'salla theme auth', {
          stdio: 'inherit'
        }
      );
    }


  }


  packageData(){
    try {
      var packageObj = require(process.cwd() + '/package.json');
    } catch (e) {
      // There was no package.json
      console.log('no package.json found!');
      return;
    }
    return packageObj;
  }
}

module.exports = ThemeWatch