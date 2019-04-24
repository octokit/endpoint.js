export = endpointWithDefaults

import merge = require('./merge')
import parse = require('./parse')

import { EndpointDefaultOptions, EndpointOptions, RequestOptions, Route, RouteOptions } from './types'

function endpointWithDefaults (defaults: EndpointDefaultOptions, route: Route | EndpointOptions, options?: RouteOptions) {
  return parse(merge(defaults, route, options))
}
