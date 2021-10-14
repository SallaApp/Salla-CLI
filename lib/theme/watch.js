const inquirerModule = require("inquirer");
const axios = require('axios');
const {
  join
} = require("path");

const WebDevServer = require("web-dev-server");
const open = require("open");


const {
  execSync
} = require('child_process')
const ConfManager = require("./utils/ConfigManager");
const AuthenticationManager = require("./utils/AuthenticationManager");
const {
  THEME_PATH,
  DRAFT_THEME_ENDPOINT
} = require("../../constants")


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


    if (cliOptions.test) {
      console.log("jsut for test")
      return null
    }
    //If the token file exist
    if (this._AuthManager.isExists()) {
      // console.log("Auth file is exists")
      if (cliOptions.skipStart) {
        // Go with salla theme push --soft

        // wait untit finishing push to github
        execSync(
          'salla theme push --soft', {
            stdio: 'inherit'
          }
        )



       // await this.createLocalServer()
        const {
          preview_url
        } = await this.createDraftTheme();
        const previewUrl = preview_url + "&assets_url=http://localhost:8181";
        console.log("Preview Url:", previewUrl)
        open(previewUrl)


        //console.log("watch with --skip-start")
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


  async createDraftTheme() {
    const {
      salla
    } = await this._AuthManager.read();
    const accesstToken = salla['accesst-token'];
    const {
      repo_url,
      themeName,
      themeId
    } = await this._ConfigManager.read();

    // console.log("accesstToken", accesstToken)
    // console.log("repository", repo_url)
    // console.log("themeName", themeName)
    // console.log("themeId", themeId)
    const config = {
      method: 'post',
      url: DRAFT_THEME_ENDPOINT,
      headers: {
        'Authorization': `Bearer ${accesstToken}`,
        'CF-Access-Client-Id': '695ade2783e811dc18e23b2334ac886c.access',
        'CF-Access-Client-Secret': 'b2b925480ae38f3675525855dfcd934b811522263a3c9d7e99a0f9bd7bac86ac',
      },
      data: {
        repo_url: repo_url,
        name: themeName,
        theme_id: themeId
      }
    };

    const responce = axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
        const {
          id,
          preview_url,
          theme_id
        } = response.data.data;
        return {
          draft_id: id,
          preview_url: preview_url,
          theme_id: theme_id
        }
      })
      .catch(function (error) {
        if (error.response) {
          //console.log(error.response.data.error.fields.repo_url);
          console.info(error.response.data.error.fields);
        }
      });

    return responce;
  }


  async createLocalServer() {
    const assetsPath = join(THEME_PATH, "assets")
    // Create web server instance.
    WebDevServer.Server.CreateNew()
      // Required.
      .SetDocumentRoot(assetsPath)
      // Optional, 8000 by default.
      .SetPort(8181)
      // Optional, '127.0.0.1' by default.
      //.SetHostname('127.0.0.1')
      // Optional, `true` by default to display Errors and directories.
      //.SetDevelopment(false)
      // Optional, `null` by default, useful for Apache `mod_proxy` usage.
      //.SetBasePath('/assets')
      // Optional, custom place to log any unhandled errors.
      //.SetErrorHandler(async function (err,code,req,res) {})
      // Optional, to prepend any execution before `web-dev-server` module execution.
      .AddPreHandler(async function (req, res, event) {
        if (req.GetPath() == '/health') {
          res.SetCode(200).SetBody('1').Send();
          // Do not anything else in `web-dev-server` module for this request:
          event.PreventDefault();
        }
        /*setTimeout(() => {
           throw new RangeError("Uncatched test error.");
        }, 1000);*/
      })
      // optional, callback called after server has been started or after error ocured
      .Start(function (success, err) {
        if (!success) console.error(err);
        console.log("Server is running.");
      });
  }
}

module.exports = ThemeWatch