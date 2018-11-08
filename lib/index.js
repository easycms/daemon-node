'use strict'
/**
 * 导出守护进程的Promise
 */
module.exports = daemon
// 配置包
const pkg = require('./pkg.js')
const daemonServerListen = require('./server/index.js')
/**
 * 导入守护进程的服务模块
 */

function daemon () {
  return Promise.all([
    daemonServerListen(),
    daemonTitle()
  ]).then(() => daemon)
}
/**
 * 设置进程标题
 */
function daemonTitle () {
  process.title = 'easycms-damemon-v' + pkg.version
}
