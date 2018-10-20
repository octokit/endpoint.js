const getUserAgent = require('universal-user-agent')

module.exports = defaults

function defaults () {
  const version = require('../package.json').version
  const userAgent = `octokit-endpoint.js/${version} ${getUserAgent()}`

  return {
    method: 'get',
    baseUrl: 'https://api.github.com',
    headers: {
      accept: 'application/vnd.github.v3+json',
      'user-agent': userAgent
    }
  }
}
