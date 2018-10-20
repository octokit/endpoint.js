module.exports = endpoint

const defaultsDeep = require('lodash/defaultsDeep')
const intersection = require('lodash/intersection')
const mapKeys = require('lodash/mapKeys')
const omit = require('lodash/omit')
const urlTemplate = require('url-template')

const addQueryParameters = require('./lib/add-query-parameters')
const extractUrlVariableNames = require('./lib/extract-url-variable-names')

const getDefaults = require('./lib/defaults')

function endpoint (route, options) {
  if (typeof route === 'string') {
    const [method, url] = route.split(' ')
    options = Object.assign({ method, url }, options)
  } else {
    options = route
  }

  // lowercase header names
  options.headers = mapKeys(options.headers, (value, key) => key.toLowerCase())

  options = defaultsDeep({}, options, getDefaults())

  let method = options.method.toLowerCase()
  let baseUrl = options.baseUrl
  let url = options.url
  let body = options.body
  let headers = options.headers
  let remainingOptions = omit(options, ['baseUrl', 'headers', 'method', 'url'])

  // replace :varname with {varname} to make it RFC 6570 compatible
  url = url.replace(/:([a-z]\w+)/g, '{+$1}')

  // extract variable names from URL to calculate remaining variables later
  const urlVariableNames = extractUrlVariableNames(url)

  url = urlTemplate.parse(url).expand(remainingOptions)

  if (!/^http/.test(url)) {
    url = baseUrl + url
  }

  remainingOptions = omit(remainingOptions, intersection(Object.keys(options), urlVariableNames).concat('baseUrl'))

  if (['get', 'head'].includes(method)) {
    url = addQueryParameters(url, remainingOptions)
  } else {
    if ('data' in remainingOptions) {
      body = remainingOptions.data
    } else {
      if (Object.keys(remainingOptions).length) {
        body = remainingOptions
      } else {
        headers['content-length'] = 0
      }
    }
  }

  const requestOptions = {
    method,
    url,
    headers
  }

  if (typeof body !== 'undefined') {
    requestOptions.body = body
  }

  return requestOptions
}
