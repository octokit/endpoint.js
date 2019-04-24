export = withDefaults

import endpointWithDefaults = require('./endpoint-with-defaults')
import merge = require('./merge')
import parse = require('./parse')

import { EndpointOptions, EndpointDefaultOptions, endpoint, Route, RouteOptions } from './types'

function withDefaults(oldDefaults: EndpointDefaultOptions | null, newDefaults: RouteOptions): endpoint {
  const DEFAULTS = merge(oldDefaults, newDefaults)
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS)

  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  })
}
