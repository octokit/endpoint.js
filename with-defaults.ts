import endpointWithDefaults = require('./lib/endpoint-with-defaults')
import merge = require('./lib/merge')
import parse = require('./lib/parse')

export = function withDefaults (oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults)
  return Object.assign(endpointWithDefaults.bind(null, DEFAULTS), {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  })
}
