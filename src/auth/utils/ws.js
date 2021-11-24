module.exports = class WsAuthManager {
  _WS_SALLA_API_URL = "";
  _TOKEN_DATA = null;
  createWs = () => {
    let ws = new WebSocket(this._WS_SALLA_API_URL);
    ws.send("getToken");
    return ws;
  };
  listen = (ws, cb) => {
    ws.on("RECVIED_TOKENS", (data) => {
      _TOKEN_DATA = data;
    });
  };
  getToken = (time_in_secs) => {
    return new Promise((resolve, reject) => {
      let wstimer = setInterval(() => {
        if (_TOKEN_DATA) {
          resolve({ msg: "ok", _TOKEN_DATA });
        }
        time_in_secs--;
        if (time_in_secs < -1) {
          resolve({ msg: "timeout" });
          clearInterval(wstimer);
        }
      }, 1000);
    });
  };
};
