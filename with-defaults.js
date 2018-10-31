module.exports = withDefaults

const merge = require('deepmerge')
const isPlainObject = require('is-plain-object')

const endpointWithDefaults = require('./lib/endpoint-with-defaults')
const lowercaseKeys = require('./lib/lowercase-keys')
const optionsWithDefaults = require('./lib/default-options')
const toRequestOptions = require('./lib/to-request-options')

function withDefaults (oldDefaults, newDefaults) {
  newDefaults.headers = lowercaseKeys(newDefaults.headers)
  const DEFAULTS = merge.all([oldDefaults, newDefaults].filter(Boolean), { isMergeableObject: isPlainObject })
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS)
  endpoint.DEFAULTS = DEFAULTS
  endpoint.defaults = withDefaults.bind(null, DEFAULTS)
  endpoint.options = optionsWithDefaults.bind(null, DEFAULTS)
  endpoint.parse = toRequestOptions
  return endpoint
}
