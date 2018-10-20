module.exports = withDefaults

const defaultsDeep = require('lodash/defaultsDeep')

const endpointWithDefaults = require('./lib/endpoint-with-defaults')
const DEFAULTS = require('./lib/defaults')

function withDefaults (newDefaults) {
  const defaults = defaultsDeep({}, newDefaults, DEFAULTS)
  return endpointWithDefaults.bind(null, defaults)
}
