'use strict'
module.exports = consoleInit
const ConsoleBase = require('./base.js')
// 打印实例池
const ponds = Object.create(null)
// 自增id
var i = 0
Object.assign(consoleInit, {
  init,
  stop
})

/**
 * 初始化
 */
async function consoleInit () {}

/**
 * 启动应用
 * @param      {<type>}  appid   The appid
 */
async function init (data) {
  const consoleId = createConsoleId()

  if (ponds[consoleId] && ponds[consoleId] instanceof ConsoleBase) {
    throw new Error(`instance already exists, consoleId: ${consoleId}`)
  } else {
    ponds[consoleId] = new ConsoleBase(consoleId, data)
    return consoleId
  }
}

/**
 * 停止控制台
 * @param      {<type>}  appid   The appid
 */
function stop (consoleId) {
  if (ponds[consoleId] && ponds[consoleId] instanceof ConsoleBase) {
    ponds[consoleId].stop()
  }
  return Promise.resolve()
}

function createConsoleId () {
  return ++i
}
