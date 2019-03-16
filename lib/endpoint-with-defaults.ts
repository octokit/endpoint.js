import merge = require('./merge')
import parse = require('./parse')

export = function endpointWithDefaults (defaults: typeof import("./defaults"), route: any, options: any) {
  return parse(merge(defaults, route, options))
}
