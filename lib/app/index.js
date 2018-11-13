'use strict'
const appLaunch = (module.exports = require('./process-launch.js'))
const getConfig = require('../utils/ecosystem-config')
const which = require('../utils/which')
const spawn = require('../utils/spawn')
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
  clone,
  install
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
async function remove ({
  appid
}) {
  if (appid === 'all') {
    Object.keys(appPonds).forEach(async appid => {
      await stop(appid)
      delete appPonds[appid]
    })
  } else if (appPonds[appid]) {
    await stop(appid)
    delete appPonds[appid]
  }
}

/**
 * 克隆应用
 * @param {String|Number} appid 应用id
 */
async function clone ({
  appid
}) {
  if (appPonds[appid]) {
    try {
      // 拉取项目
      const folder = await git.clone(appPonds[appid].repo, process.env.EASYCMS_TEMP_PATH)
      appPonds[appid].templatePath = folder
      return appPonds[appid]
    } catch (err) {
      throw err
    }
  } else {
    throw new Error('appid is not exist')
  }
}

/**
 * 下载依赖
 * @param {String|Number} appid 应用id
 * @param {String} templatePath 应用地址
 */
async function install ({
  appid,
  templatePath
}) {
  try {
    if (!appid) {
      throw new Error('appid is not found')
    }
    if (!templatePath) {
      throw new Error('templatePath is not found')
    }
    // 获取pkg
    const appPkg = getConfig(templatePath)
    // pkg路劲
    if (appPkg.configPath) {
      const appPkgConf = require(appPkg.configPath)

      if (appPkg.easycmsAppType === 'nuxt') {
        await spawn('npm', ['i'], {
          cwd: templatePath
        })
      }
      Object.assign(appPonds[appid], which(appPkgConf, templatePath))
    }

    appPonds[appid].env = appPonds[appid].env
      ? Object.assign(appPonds[appid].env, {
        cwd: templatePath
      }) : {
        cwd: templatePath
      }
    return appPonds[appid]
  } catch (error) {
    throw error
  }
}

function createAppId () {
  return ++i
}
