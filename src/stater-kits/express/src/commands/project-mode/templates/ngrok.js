/* easy mode */
const ngrok = require("ngrok");
(async function () {
  const url = await ngrok.connect(port);
  console.log("    =>    Remote App Url :", url);
})();
