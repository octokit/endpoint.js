module.exports = endpointWithDefaults

const merge = require('deepmerge')
const isPlainObject = require('is-plain-object')
const urlTemplate = require('url-template')

const addQueryParameters = require('./add-query-parameters')
const extractUrlVariableNames = require('./extract-url-variable-names')
const omit = require('./omit')

function endpointWithDefaults (defaults, route, options) {
  if (typeof route === 'string') {
    const [method, url] = route.split(' ')
    options = Object.assign({ method, url }, options)
  } else {
    options = route
  }

  // lowercase header names before merging with defaults to avoid duplicates
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key]
      return newObj
    }, {})
  }

  options = merge.all([defaults, options].filter(Boolean), { isMergeableObject: isPlainObject })

  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase()

  // replace :varname with {varname} to make it RFC 6570 compatible
  let url = options.url.replace(/:([a-z]\w+)/g, '{+$1}')

  let headers = options.headers
  let body
  let remainingOptions = omit(options, ['method', 'baseUrl', 'url', 'headers', 'request'])

  // extract variable names from URL to calculate remaining variables later
  const urlVariableNames = extractUrlVariableNames(url)

  url = urlTemplate.parse(url).expand(remainingOptions)

  if (!/^http/.test(url)) {
    url = options.baseUrl + url
  }

  const omittedOptions = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat('baseUrl')
  remainingOptions = omit(remainingOptions, omittedOptions)

  // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
  if (['GET', 'HEAD'].includes(method)) {
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

  // default content-type for JSON if body is set
  if (!headers['content-type'] && typeof body !== 'undefined') {
    headers['content-type'] = 'application/json; charset=utf-8'
  }

  // GitHub expects "content-length: 0" header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string
  if (['PATCH', 'PUT'].includes(method) && typeof body === 'undefined') {
    body = ''
  }

  // Only return body/request keys if present
  return Object.assign(
    { method, url, headers },
    typeof body !== 'undefined' ? { body } : null,
    options.request ? { request: options.request } : null
  )
}
