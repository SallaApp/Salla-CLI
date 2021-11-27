const clc = require("cli-color");
module.exports.createMessage = (msg, type, sideMessage) => {
  if (type == "err")
    return { msg: `[x] ${msg}`, color: "redBright", type, sideMessage };
  if (type == "succ")
    return { msg: `[ok] ${msg}`, color: "greenBright", type, sideMessage };
  if (type == "info")
    return { msg: `[!] ${msg}`, color: "blueBright", type, sideMessage };
};
module.exports.printMessage = (msg) => {
  console.log("                    ");
  console.log(clc[msg.color](msg.msg));
  if (msg.sideMessage) console.log(clc["red"](msg.sideMessage));
};
function flatArray(arr) {
  if (typeof arr === "object" && !arr.length) return [arr];
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
    console.log("                    ");
    console.log(clc[msgs[i].color](msgs[i].msg));
    if (msgs[i].sideMessage) console.log(clc["red"](msgs[i].sideMessage));
  }
};
module.exports.longLine = (err) => console.log("                    ");
