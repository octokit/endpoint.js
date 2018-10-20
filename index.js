const withDefaults = require('./with-defaults')
const endpointWithDefaults = require('./lib/endpoint-with-defaults')
const DEFAULTS = require('./lib/defaults')

module.exports = endpointWithDefaults.bind(null, DEFAULTS)
module.exports.DEFAULTS = DEFAULTS
module.exports.defaults = withDefaults
