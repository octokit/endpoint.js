module.exports = withDefaults

const defaultsDeep = require('lodash/defaultsDeep')

const endpointWithDefaults = require('./lib/endpoint-with-defaults')

function withDefaults (oldDefaults, newDefaults) {
  const DEFAULTS = defaultsDeep({}, newDefaults, oldDefaults)
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS)
  endpoint.DEFAULTS = DEFAULTS
  endpoint.defaults = withDefaults.bind(null, DEFAULTS)
  return endpoint
}
