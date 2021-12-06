const should = require("should");
require("../../constants");

const fs = require("fs-extra");
const path = require("path");

const test_path = path.resolve(__dirname + "/../test_projects");
describe("Testing Utils Classes and Functions ", function () {
  before(function () {
    fs.mkdirSync(test_path);
  });

  after(function () {
    fs.removeSync(test_path);
  });

  it("should mkdir with ExecutionManager ", function (done) {
    const ExecutionManager = require("../../src/utils/ExecutionManager");
    const executionManager = new ExecutionManager();
    let dir_path = test_path + "/something";
    executionManager
      .run([
        {
          cmd: "makedir",
          path: dir_path,
          msg: "Making Project Folder",
        },
      ])
      .finally(() => {
        try {
          should(fs.lstatSync(dir_path).isDirectory()).be.equal(true);
          done();
        } catch (err) {
          done(err);
        }
      });
  });
  // TODO: Add more tests
});
