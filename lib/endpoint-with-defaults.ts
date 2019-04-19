export = endpointWithDefaults

import merge = require('./merge')
import parse = require('./parse')

function endpointWithDefaults (defaults: typeof import("./defaults"), route: string, options: { method?: string; url?: string; [key: string]: any }) {
  return parse(merge(defaults, route!, options))
}
