import { endpointWithDefaults } from './endpoint-with-defaults'
import { merge } from './merge'
import { parse } from './parse'
import { EndpointOptions, EndpointDefaultOptions, endpoint, Route, RouteOptions } from './types'

export function withDefaults (oldDefaults: EndpointDefaultOptions | null, newDefaults: RouteOptions): endpoint {
  const DEFAULTS = defaultOptions(oldDefaults, newDefaults)
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS)

  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  })
}
