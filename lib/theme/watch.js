const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default

const inquirerModule = require("inquirer");
const SallaConfigManager = require("./SallaConfigManager");

const path = require('path');
const ROOT = process.cwd();
const fs = require("fs");



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
    console.log("cliOptions %o", cliOptions)
    const config = this.webpackConfig();
    const compiler = webpack(config);

    // compiler.run((err, stats) => { // [Stats Object](#stats-object)
    //   // ...
    //  // console.log("stats",stats.toString({colors: true}));
    //    compiler.close((closeErr) => {
    //     // ...
    //   // console.log("closeErr",closeErr)  

    //   });
    // });

    compiler.watch({
      // Example [watchOptions](/configuration/watch/#watchoptions)
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
      followSymlinks: true,

    }, (err, stats) => { // [Stats Object](#stats-object)
      // Print watch/build result here...
      console.log(stats.toString({
        colors: true
      }));
    });


    compiler.hooks.watchRun.tap('WatchRun', (comp) => {
      if (comp.modifiedFiles) {
        const changedFiles = Array.from(comp.modifiedFiles, (file) => `\n  ${file}`).join('');
        console.log('===============================');
        console.log('FILES CHANGED:', changedFiles);
        console.log('===============================');
      }
    });

    console.log('------------------');
    console.log('theme Watch TODO');
    console.log('------------------');


  }
  

  webpackConfig() {
    return {
      mode: 'development',
      entry: './app/js/script.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
      },
      module: {
        rules: [{
          test: /\.html$/i,
          loader: "html-loader",
        }, ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          templateContent: ({
            htmlWebpackPlugin
          }) => '<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>' + htmlWebpackPlugin.options.title + '</title></head><body><div id=\"app\"></div></body></html>',
          filename: 'index.html',
        }),

        new WatchExternalFilesPlugin({
          files: [
            './**/*.html',
            './**/*.js',
            '!./*.test.js'
          ]
        })
      ],

    }
  }

}



module.exports = SallaThemeWatch