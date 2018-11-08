'use strict'
const Koa = require('koa')
const http = require('http')
const https = require('https')
const WebSocket = require('ws')
const json = require('@easyke/daemon-api/lib/utils/json.js')
const onApiRpcCall = require('../rpc/index.js')
const { serialize } = require('@easyke/daemon-api/lib/utils/error.serialize.js')
const app = new Koa()
const wsServer = new WebSocket.Server({ noServer: true })
const httpServer = http.createServer(app.callback())
const httpsServer = https.createServer(app.callback())
const wsPonds = Object.create(null)
const wsid = Symbol('wsid')
// 调试
const debug = require('debug')('easycms:daemon:server')

httpServer.on('upgrade', upgrade)
httpsServer.on('upgrade', upgrade)
function upgrade (request, socket, head) {
  // 权限判断
  // if (false) {
  //   socket.destroy()
  // }
  wsServer.handleUpgrade(request, socket, head, function done (ws) {
    onWsConnection(ws, request)
  })
}
app.use(async ctx => {
  ctx.body = 'Hello World'
})
function onWsMessage (data, { ws }) {
  debug('ws onWsMessage', data)
  return json.parse(data)
    .then(data => {
      if (data.requestId) {
        onApiRpcCall(data.data)
          .then(res => ({ res }), e => ({ error: serialize(e) }))
          .then(sendData => {
            sendData.requestId = data.requestId
            return json.stringify(sendData)
          })
          .then(data => new Promise((resolve, reject) => {
            ws.send(data, e => e ? reject(e) : resolve())
          }))
      } else {
        debug('没有请求id')
        debug(data)
      }
    }, e => debug(e))
}
function onWsConnection (ws, request) {
  ws[wsid] = Symbol('wsid')
  wsPonds[ws[wsid]] = ws
  ws.on('error', function (e) {
    debug('ws on error', e)
    try {
      if (ws && ws[wsid]) {
        delete wsPonds[ws[wsid]]
      }
      this.close()
    } catch (e) {}
  })
  ws.on('close', function () {
    debug('ws on close')
    try {
      if (ws && ws[wsid]) {
        delete wsPonds[ws[wsid]]
      }
    } catch (e) {}
  })
  ws.on('timeout', function () {
    debug('ws on timeout')
    try {
      if (ws && ws[wsid]) {
        delete wsPonds[ws[wsid]]
      }
      this.close()
    } catch (e) {}
  })
  ws.on('message', data => onWsMessage.call(ws, data, { ws, request, wsid }))
}
module.exports = [httpServer, httpsServer]
