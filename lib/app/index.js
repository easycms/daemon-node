'use strict'
const appLaunch = (module.exports = require('./process-launch.js'))
const appPonds = Object.create(null)
const git = require('../git')
var i = 0
Object.assign(appLaunch, {
  start,
  stop,
  restart,
  reload,
  remove,
  create,
  clone
})

/**
 * 创建应用
 * @param {Object} data repo,cwd
 */
async function create (data) {
  const appid = createAppId()
  // 没有远程地址，跑出错误
  if (!data.repo) {
    throw new Error('repo is not found')
  }
  // id已经存在，再次创建
  if (appPonds[appid]) {
    return create(data)
  }
  appPonds[appid] = Object.assign(data, {
    appid: appid
  })
  return appid
}

/**
 * 启动应用
 * @param      {<type>}  appid   The appid
 */
function start (appid) {
  if (appPonds[appid]) {}
  return Promise.resolve()
}

/**
 * 停止应用
 * @param      {<type>}  appid   The appid
 */
function stop (appid) {
  if (appPonds[appid]) {}
  return Promise.resolve()
}

/**
 * 重新启动应用
 * @param      {<type>}  appid   The appid
 */
function restart (appid) {
  return Promise.resolve().then(() => stop(appid)).then(() => start(appid))
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

/**
 * 克隆应用
 * @param {String|Number} appid 应用id
 */
async function clone ({
  appid
}) {
  if (appPonds[appid]) {
    return git.clone(appPonds[appid].repo, process.env.EASYCMS_TEMP_PATH)
  } else {
    throw new Error('appid is not exist')
  }
}

function createAppId () {
  return ++i
}
