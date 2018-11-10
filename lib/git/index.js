const Git = require('nodegit')
const path = require('path')
module.exports = {
  clone
}

/**
 *
 * @param {String} url git url
 * @param {String} path 目录地址
 * @param {Object} opts 参数
 */
function clone (url, appPath, opts = {}) {
  let folderName = getFolderName(url)
  appPath = path.resolve(appPath, folderName)
  let cloneOptions = {
    // 拉取的分支，暂时主分支
    checkoutBranch: opts.branch || 'master',
    fetchOpts: {
      callbacks: {
        credentials,
        certificateCheck: 1
      }
    }
  }
  return Git.Clone.clone(url, appPath, cloneOptions)
    .then(repo => {
      folderName = appPath = cloneOptions = void 0
      return repo
    })
    .catch(e => {
      return Promise.reject(new Error(e.message))
    })
}

/**
 * 获取默认项目名
 * @param {String} path 地址
 */
function getFolderName (path) {
  if (typeof path === 'string') {
    var strList = path.split('.git')[0].split('/')
    return strList[strList.length - 1]
  }
  return ''
}

/**
 * 证书检查
 * username, password 暂时写死
 */
function credentials () {
  return Git.Cred.userpassPlaintextNew('ddvcmssync', 'ddvcmssync654321')
}
