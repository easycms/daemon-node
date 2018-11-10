const {
  spawnSync
} = require('child_process')

function spawn (cmd, args, opts = {}) {
  let baseOpts = {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  }
  if (typeof opts === 'object' && opts) {
    Object.assign(opts, baseOpts)
  } else {
    opts = baseOpts
  }
  return new Promise((resolve, reject) => {
    var ls = spawnSync(cmd, args, opts)

    if (ls.error) {
      reject(ls.error)
    } else {
      resolve()
    }
  })
}
module.exports = spawn
