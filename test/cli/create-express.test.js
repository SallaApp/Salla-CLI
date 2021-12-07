const should = require("should");
require("../../constants");

const fs = require("fs-extra");
const path = require("path");

const test_path = path.resolve(__dirname + "/../test_projects");
describe("Creating ExpressJS Salla App ", function () {
  before(function () {
    fs.mkdirSync(test_path);
  });

  after(function () {
    fs.removeSync(test_path);
  });

  it("should create Salla ExpressJS App ", function (done) {
    shell.exec("salla app create test_express_project");
  });
  it("should create Salla Laravel App ", function (done) {
    shell.exec(
      "composer create-project salla/laravel-starter-kit test_laravel_project"
    );
  });
});
