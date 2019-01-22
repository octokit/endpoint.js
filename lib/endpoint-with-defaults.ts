const merge = require('./merge')
const parse = require('./parse')

export = function endpointWithDefaults (defaults, route, options) {
  return parse(merge(defaults, route, options))
}
