module.exports = class api {
  // for dev only

  getApps() {
    return require("../../tmp/apps.json");
  }
  selectedApp() {
    return require("../../tmp/selected_app.json");
  }
  update() {
    console.log("redirect url is updated");
  }
};
