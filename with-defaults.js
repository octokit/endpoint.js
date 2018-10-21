module.exports = withDefaults

const merge = require('deepmerge')

const endpointWithDefaults = require('./lib/endpoint-with-defaults')

function withDefaults (oldDefaults, newDefaults) {
  const DEFAULTS = merge.all([oldDefaults, newDefaults].filter(Boolean))
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS)
  endpoint.DEFAULTS = DEFAULTS
  endpoint.defaults = withDefaults.bind(null, DEFAULTS)
  return endpoint
}
