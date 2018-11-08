module.exports = onApiRpcCall

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
  'server.stop' () {
    setTimeout(() => { process.exit(0) }, 10)
    return Promise.resolve()
  }
})
