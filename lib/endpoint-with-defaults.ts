import merge = require('./merge')
import parse = require('./parse')

export = function endpointWithDefaults (defaults: any, route: any, options: any) {
  return parse(merge(defaults, route, options))
}
