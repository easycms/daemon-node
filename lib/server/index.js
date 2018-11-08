'use strict'
const fs = require('fs')
const net = require('net')
const tls = require('tls')
const [netServer] = require('./server.js')
module.exports = daemonServerListen

const listenLists = [
  {
    'type': 'unix+sock',
    'address': process.env.EASYCMS_DAEMON_RPC_PORT
  }
]
function daemonServerListen () {
  return Promise.all(listenLists.map(({ type, address }) => listen(type, address)))
}

async function listen (type, address) {
  let isSocket = false
  if (type === 'unix+sock') {
    try {
      const res = await stat(address)
      isSocket = res.isSocket() || res.isFIFO() || res.isSymbolicLink() || res.isBlockDevice() || res.isCharacterDevice() || res.isFile()
    } catch (e) {
      isSocket = false
    }
    if (isSocket) {
      await new Promise((resolve, reject) => {
        fs.unlink(address, err => err ? reject(err) : resolve())
      })
    }
  }
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'tls':
      case 'ssl':
        type = 'tls'
        break
      case 'tcp':
      case 'unix':
        type = 'net'
        break
      case 'unix+sock':
        isSocket = true
        type = 'net'
        break
    }
    try {
      if (type === 'tls') {
        tls.createServer(socket => netServer.emit('connection', socket)).once('error', reject).listen(address, function () {
          this.removeListener('error', reject)
          resolve()
        })
      } else {
        net.createServer(socket => netServer.emit('connection', socket)).once('error', reject).listen(address, function () {
          this.removeListener('error', reject)
          resolve()
        })
      }
    } catch (e) {
      reject(e)
    }
  })
    .then(() => (isSocket && address) ? stat(address) : void 0)
    .then(stat => {
      if (stat && stat.isSocket()) {
        return new Promise(resolve => fs.chmod(address, 0o666, resolve))
      }
    })
}

function stat (address) {
  return new Promise((resolve, reject) => { fs.stat(address, (e, stat) => e ? reject(e) : resolve(stat)) })
}
