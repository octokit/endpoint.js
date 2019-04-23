const fs = require('fs')
const { version } = require('../package.json')

module.exports = {
  prepare () {
    const content = fs.readFileSync('lib/version.js', 'utf8')
    fs.writeFileSync('lib/version.js', content.replace('0.0.0-development', version))
  }
}
