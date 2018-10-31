module.exports = defaultOptions

const merge = require('deepmerge')
const isPlainObject = require('is-plain-object')

function defaultOptions (defaults, route, options) {
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
  options.method = options.method.toUpperCase()

  // replace :varname with {varname} to make it RFC 6570 compatible
  options.url = options.url.replace(/:([a-z]\w+)/g, '{+$1}')

  return options
}
