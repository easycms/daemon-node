'use strict'
const appLaunch = module.exports = require('./process-launch.js')
const appPonds = Object.create(null)
Object.assign(appLaunch, {
  start,
  stop,
  restart,
  reload,
  remove
})

/**
 * 启动应用
 * @param      {<type>}  appid   The appid
 */
function start (appid) {
  if (appPonds[appid]) {

  }
  return Promise.resolve()
}

/**
 * 停止应用
 * @param      {<type>}  appid   The appid
 */
function stop (appid) {
  if (appPonds[appid]) {

  }
  return Promise.resolve()
}

/**
 * 重新启动应用
 * @param      {<type>}  appid   The appid
 */
function restart (appid) {
  return Promise.resolve()
    .then(() => stop(appid))
    .then(() => start(appid))
}

/**
 * 重载应用配置
 * @param      {<type>}  appid   The appid
 */
function reload (appid) {
  return Promise.resolve()
}
/**
 * 移除应用配置
 * @param      {<type>}  appid   The appid
 */
function remove (appid) {
  return Promise.resolve()
}
