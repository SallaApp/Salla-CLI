function SallaReload() {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = protocol + window.location.host + window.location.pathname + '/ws';
  const ws = new WebSocket(address);
  ws.onmessage = function(msg) {
    location.reload();
  };
  console.log('%cLive reload is currently enabled.', 'color: #bada55');
  
}

SallaReload();