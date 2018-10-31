module.exports = endpointWithDefaults

const defaultOptions = require('./default-options')
const toRequestOptions = require('./to-request-options')

function endpointWithDefaults (defaults, route, options) {
  const endpointOptions = defaultOptions(defaults, route, options)
  return toRequestOptions(endpointOptions)
}
