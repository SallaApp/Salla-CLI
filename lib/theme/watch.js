const inquirerModule = require("inquirer");
const axios = require('axios');
const FormData = require('form-data');


const {
  execSync
} = require('child_process')
const ConfManager = require("./utils/ConfigManager");
const AuthenticationManager = require("./utils/AuthenticationManager");
const { DRAFT_THEME_ENDPOINT } = require("../../constants")


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
     // console.log("Auth file is exists")
      if (cliOptions.skipStart) {
        // Go with salla theme push --soft
     
        execSync(
          'salla theme push --soft', {
            stdio: 'inherit'
          }
        )


        //Create a draft theme using the endpoint
        const draftTheme = await this.createDraftTheme();
        //console.log("draftTheme", draftTheme)


        //console.log("watch with --skip-start")
        // TODO :: check the type of package manager in OS (npm/yarn)
        // check if watch defined in package.json
        if (this.packageData().scripts.hasOwnProperty("watch")) {
          // execSync(
          //   'npm run watch', {
          //     stdio: 'inherit'
          //   }
          // );
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


  packageData() {
    try {
      var packageObj = require(process.cwd() + '/package.json');
    } catch (e) {
      // There was no package.json
      console.log('no package.json found!');
      return;
    }
    return packageObj;
  }


  async createDraftTheme(){
    const { salla } = await this._AuthManager.read();
    const accesstToken = salla['accesst-token'];

    var data = new FormData();
    data.append('repo_url', '');

    var config = {
      method: 'post',
      url: DRAFT_THEME_ENDPOINT,
      headers: { 
        'Authorization': `Bearer ${accesstToken}`, 
        ...data.getHeaders()
      },
      data : data
    };
    
    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });


  }
}

module.exports = ThemeWatch