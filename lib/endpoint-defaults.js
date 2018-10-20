module.exports = endpointDefaults

const defaultsDeep = require('lodash/defaultsDeep')

const endpointWithDefaults = require('./endpoint-with-defaults')
const getDefaults = require('./get-defaults')

function endpointDefaults (newDefaults) {
  const defaults = defaultsDeep({}, newDefaults, getDefaults())
  return endpointWithDefaults.bind(null, defaults)
}
