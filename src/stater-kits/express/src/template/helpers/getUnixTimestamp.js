// getUnixTimestamp
module.exports = function getUnixTimestamp() {
  return Math.round(new Date().getTime() / 1000);
};
