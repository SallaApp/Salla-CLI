const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default

const inquirerModule = require("inquirer");
const SallaConfigManager = require("./SallaConfigManager");

const path = require('path');
const ROOT = process.cwd();
const fs = require("fs");

const {series} = require("async");
const {exec} = require('child_process');



//const WebpackConfig = require(path.join(process.cwd(), 'webpack.config'));
const WebpackConfig = require(path.join(process.cwd(), "node_modules/laravel-mix/setup/webpack.config.js"));



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
    // console.log("cliOptions %o", cliOptions)
    // console.log("WebpackConfig",WebpackConfig);
   // const config = WebpackConfig;
    //const compiler = webpack(config);
    //compiler.run((err, stats) => { // [Stats Object](#stats-object)
    //   // ...
    //   // console.log("stats",stats.toString({colors: true}));
    //    compiler.close((closeErr) => {
    //     // ...
    //   // console.log("closeErr",closeErr)  

    //   });
    //});

    // compiler.watch({
    //   // Example [watchOptions](/configuration/watch/#watchoptions)
    //   aggregateTimeout: 300,
    //   poll: 1000,
    //   ignored: /node_modules/,
    //   followSymlinks: true,

    // }, (err, stats) => { // [Stats Object](#stats-object)
    //   // Print watch/build result here...
    //   if(err){
    //     console.log(err.toString({
    //       colors: true
    //     }));
    //   }
    // });

    console.log("watching.....")
    series([
      () => exec('npm run development -- --watch'),
     ]); 

  }


  webpackConfig() {
    return {
      mode: 'development',
      entry: './assets/js/main.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
      },
      module: {
        rules: [{
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          }

        ]
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
            './**/*.twig',
            '!./*.test.js'
          ]
        })
      ],

    }
  }

}



module.exports = SallaThemeWatch