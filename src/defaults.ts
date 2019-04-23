import getUserAgent = require('universal-user-agent')

const version = require('./version')
const userAgent = `octokit-endpoint.js/${version} ${getUserAgent()}`

export = {
  method: 'GET',
  baseUrl: 'https://api.github.com',
  headers: {
    accept: 'application/vnd.github.v3+json',
    'user-agent': userAgent
  },
  mediaType: {
    format: '',
    previews: [] as string[]
  }
}
