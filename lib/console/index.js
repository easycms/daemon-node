'use strict'
module.exports = consoleInit
const ponds = Object.create(null)
let i = 0
Object.assign(consoleInit, {
  start,
  stop,
  restart,
  reload,
  remove
})

function consoleInit () {
  return Promise.resolve()
}

/**
 * 启动应用
 * @param      {<type>}  appid   The appid
 */
function init (data) {
  const consoleId = createConsoleId()
  if (data.type) {}
  ponds[consoleId] = data
  if (ponds[consoleId]) {
    return Promise.reject(new Error(''))
  }
  return Promise.resolve(consoleId)
}

/**
 * 停止控制台
 * @param      {<type>}  appid   The appid
 */
function stop (consoleId) {
  if (ponds[consoleId]) {
    ponds[consoleId].stop()
  }
  return Promise.resolve()
}

function createConsoleId () {
  return ++i
}
