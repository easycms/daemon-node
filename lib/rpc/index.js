module.exports = onApiRpcCall

const app = require('../app/index.js')

function onApiRpcCall (data) {
  if (typeof onApiRpcCall[data.method] === 'function') {
    return Promise.resolve().then(() => onApiRpcCall[data.method](data))
  } else {
    return Promise.reject(new Error(`不存在${data.method}的方法`))
  }
}
Object.assign(module.exports, {
  ping (data) {
    return Promise.resolve()
  },
  /**
   * 服务停止
   */
  'server.stop' () {
    setTimeout(() => {
      process.exit(0)
    }, 10)
    return Promise.resolve()
  },
  /**
   * 创建应用
   * @param {Object} data
   */
  'app.create' (data) {
    return app.create(data.res)
  },
  /**
   * clone应用
   * @param {Object} data
   */
  'app.clone' (data) {
    return app.clone(data.res)
  },
  /**
   *  安装依赖
   * @param {Object} data
   */
  'app.install' (data) {
    return app.install(data.res.appid, data.res.templatePath)
  },
  /**
   * 开始应用
   */
  'app.start' (data) {
    return app.start(data.appid)
  },
  /**
   * 停止应用
   */
  'app.stop' (data) {
    return app.stop(data.appid)
  },
  /**
   * 重启应用
   */
  'app.restart' (data) {
    return app.restart(data.appid)
  },
  /**
   * 重载应用配置
   */
  'app.reload' (data) {
    return app.reload(data.appid)
  },
  /**
   * 移除应用
   */
  'app.remove' (data) {
    return app.remove(data.appid)
  },
  /**
   * 控制台初始化
   */
  'console.init' (data) {

  },
  /**
   * 控制台初始化
   */
  'console.ondata' (data) {

  }
})
