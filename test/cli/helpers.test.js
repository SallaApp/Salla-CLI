const should = require("should");
require("../../constants");

const fs = require("fs-extra");
const path = require("path");

const test_path = path.resolve(__dirname + "/../test_projects");
describe("Testing helper Functions ", function () {
  before(function () {
    fs.mkdirSync(test_path);
  });
  after(function () {
    fs.removeSync(test_path);
  });

  // Testing Classes and functions
  it("should be express project", function (done) {
    const checkFolder = require("../../src/helpers/check-folder");

    const test_path_express = test_path + "/test_express";

    fs.mkdirSync(test_path_express);

    fs.writeFileSync(test_path_express + "/package.json", JSON.stringify({}));

    let result = checkFolder(test_path_express);
    should(result).be.equal("express");
    fs.removeSync(test_path_express);
    done();
  });
  it("should be laravel project", function (done) {
    const checkFolder = require("../../src/helpers/check-folder");

    const test_path_laravel = test_path + "/test_laravel";

    fs.mkdirSync(test_path_laravel);

    fs.writeFileSync(test_path_laravel + "/artisan", JSON.stringify({}));

    let result = checkFolder(test_path_laravel);
    should(result).be.equal("laravel");
    fs.removeSync(test_path_laravel);
    done();
  });
  it("should be unknown project", function (done) {
    const checkFolder = require("../../src/helpers/check-folder");

    const test_path_unknown = test_path + "/test_express";

    fs.mkdirSync(test_path_unknown);

    fs.writeFileSync(test_path_unknown + "/test", JSON.stringify({}));

    let result = checkFolder(test_path_unknown);
    should(result).be.equal("unknown");
    fs.removeSync(test_path_unknown);
    done();
  });
  it("should generate random 64 string ", function (done) {
    const generateRandom = require("../../src/helpers/generateRandom");
    let randomObj = {};
    for (let i = 0; i < 100; i++) {
      let rand_str = generateRandom(64);
      if (randomObj[rand_str]) {
        done(new Error("Can't generate random string"));
        return;
      }
      randomObj[rand_str] = true;
    }

    done();
  });
});
