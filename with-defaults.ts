import endpointWithDefaults = require('./lib/endpoint-with-defaults')
import merge = require('./lib/merge')
import parse = require('./lib/parse')

function withDefaults (oldDefaults: typeof import('./lib/defaults') | null, newDefaults: typeof import('./lib/defaults')): any {
  const DEFAULTS = merge(oldDefaults, newDefaults)
  return Object.assign(endpointWithDefaults.bind(null, DEFAULTS), {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  })
}

export = withDefaults
