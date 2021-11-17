const Server = require('./server');

const WebSocket = require('faye-websocket')
// const chokidar = require('chokidar')
const open = require('open')

const path = require('path').posix
const fs = require('fs')

const fgColors = require('./../../colors')

let server = null,
    watcher = null,
    clients = [],
    config = {};

module.exports = class Servino {
  static start (cfg) {

    let rootPath = cfg.root
        ? cfg.isvscode ? cfg.root : path.join(process.cwd(), cfg.root).replace(/\\/g, '/')
        : process.cwd().replace(/\\/g, '/');

    config = {
      host: cfg.host || '0.0.0.0',
      port: cfg.port || 8125,
      root: rootPath,
      wdir: cfg.wdir || [rootPath],
      wait: cfg.wait || 100,
      wignore: cfg.wignore || /node_modules|(^|[\/\\])\../,
      inject: cfg.inject !== undefined ? cfg.inject : false,
      open: cfg.open !== undefined ? cfg.open : false,
      verbose: cfg.verbose !== undefined ? cfg.verbose : true
    }

    let self = this

    server = Server(config)
        .listen(config.port, config.host)
        .on('listening', () => {

          const addr = server.address()
          const address = addr.address === '0.0.0.0' ? '127.0.0.1' : addr.address
          const serverUrl = `http://${address}:${addr.port}`

          if (config.open) {
            open(serverUrl) // open in the browser
          }

          self.log('[Serving]', serverUrl)
          self.log('[CWD]', config.root)

          self.log('[Waiting For Changes]', '')
        })
        .on('error', e => {
          if (e.code === 'EADDRINUSE') {
            self.log(`Error: Port ${e.port}`, 'is already in use. Trying another port.')
            setTimeout(() => server.listen(0, config.host), 200)
          } else {
            self.log('Error: '+e.message)
            self.stop()
          }
        });

    // Create WebSocket
    server.on('upgrade', (request, socket, body) => {
      let ws = new WebSocket(request, socket, body)

      clients.push(ws)

      ws.onclose = () => {
        clients = clients.filter(i => i !== ws)
      }
    });

    return server;

    // watcher = chokidar.watch(config.wdir, {
    //   ignored: new RegExp(config.wignore, 'g'),
    //   persistent: true,
    //   ignoreInitial: true
    // })
    //     .on('add', path => {
    //       self.log('[+File To Watch]', `${path.replace(/\\/g, '/')}`, fgColors.green)
    //     })
    //     .on('change', (filePath, Stats) => {
    //       setTimeout(() => {
    //         let content = fs.readFileSync(filePath, 'utf8') // file content
    //         filePath = filePath.replace(__dirname, '') // file path
    //
    //         let fileType = 'reload'
    //         if (filePath.includes('.css')) fileType = 'reloadCss';
    //         if (filePath.includes('.js')) fileType = 'reloadJs';
    //
    //         self.log('[Change]', `${filePath} (${Stats.size} Byte)`)
    //
    //         self.reload({ fileType, content, inject: config.inject })
    //       }, config.wait)
    //     })
    //     .on('error', path => {
    //       self.log('[Error Watch] ---> ', path, fgColors.red);
    //     });
  }

  static reload (msg) {
    clients.forEach(ws => ws && ws.send(JSON.stringify(msg)))
  }

  static async stop () {
    if (watcher) {
      await watcher.close()
    }

    // close all your connections immediately
    server.close();

    this.log('[Server Closed]', '...')
  }

  static log (label, msg, color = fgColors.cyan) {
    if (config.verbose) {
      console.log(
          color,
          '[' + new Date().toLocaleTimeString() + ']',
          label,
          fgColors.yellow,
          msg,
          fgColors.reset
      );
    }
  }
}