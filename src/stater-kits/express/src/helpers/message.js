const clc = require("cli-color");
module.exports.createMessage = (msg, type) => {
  if (type == "err") return { msg: `[x] ${msg}`, color: "redBright" };
  if (type == "succ") return { msg: `[ok] ${msg}`, color: "greenBright" };
};
module.exports.printMessage = (msg) => {
  console.log(clc[msg.color](msg.msg));
};
function flatArray(arr) {
  if (!arr) return [];
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      newArr = newArr.concat(flatArray(arr[i]));
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
module.exports.printMessages = (msgs) => {
  msgs = flatArray(msgs);
  for (let i = 0; i < msgs.length; i++) {
    console.log(clc[msgs[i].color](msgs[i].msg));
  }
};
