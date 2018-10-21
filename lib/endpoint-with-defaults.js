module.exports = endpointWithDefaults

const merge = require('deepmerge')
const urlTemplate = require('url-template')

const addQueryParameters = require('./add-query-parameters')
const extractUrlVariableNames = require('./extract-url-variable-names')

function endpointWithDefaults (defaults, route, options) {
  if (typeof route === 'string') {
    const [method, url] = route.split(' ')
    options = Object.assign({ method, url }, options)
  } else {
    options = route
  }

  // lowercase header names
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key]
      return newObj
    }, {})
  }

  options = merge.all([defaults, options].filter(Boolean))

  let body = options.body
  let method = options.method.toLowerCase()
  let baseUrl = options.baseUrl
  let url = options.url
  let headers = options.headers
  let remainingOptions = omit(options, ['method', 'baseUrl', 'url', 'headers'])

  // replace :varname with {varname} to make it RFC 6570 compatible
  url = url.replace(/:([a-z]\w+)/g, '{+$1}')

  // extract variable names from URL to calculate remaining variables later
  const urlVariableNames = extractUrlVariableNames(url)

  url = urlTemplate.parse(url).expand(remainingOptions)

  if (!/^http/.test(url)) {
    url = baseUrl + url
  }

  const omittedOptions = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat('baseUrl')

  remainingOptions = omit(remainingOptions, omittedOptions)

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

function omit (object, keysToOmit) {
  return Object.keys(object)
    .filter((option) => !keysToOmit.includes(option))
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {})
}
