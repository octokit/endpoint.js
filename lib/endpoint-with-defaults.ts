export = endpointWithDefaults

import merge = require('./merge')
import parse = require('./parse')

function endpointWithDefaults (defaults: typeof import("./defaults"), route: string, options: any) {
  return parse(merge(defaults, route, options))
}
