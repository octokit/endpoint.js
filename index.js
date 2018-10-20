const endpointDefaults = require('./lib/endpoint-defaults')
const endpointWithDefaults = require('./lib/endpoint-with-defaults')
const getDefaults = require('./lib/get-defaults')

module.exports = endpointWithDefaults.bind(null, getDefaults())
module.exports.defaults = endpointDefaults
