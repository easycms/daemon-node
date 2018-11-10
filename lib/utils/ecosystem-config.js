const path = require('path')
const fs = require('fs')
module.exports = ecosystemConfig

function ecosystemConfig (folder) {
  let files = ['package.json']
  // 暂时只有nuxt
  for (let fileName of files) {
    let jsonPath = path.join(folder, fileName)
    if (fs.existsSync(jsonPath)) {
      jsonPath.easycmsAppType = 'nuxt'
      return {
        easycmsAppType: 'nuxt',
        configPath: jsonPath
      }
    }
  }
  return ''
}
