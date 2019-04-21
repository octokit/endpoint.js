export = withDefaults

import endpointWithDefaults = require('./lib/endpoint-with-defaults')
import merge = require('./lib/merge')
import parse = require('./lib/parse')

interface withDefaults {
  (route: any, options: any): any
  DEFAULTS: (typeof import('./lib/defaults') | null) & any
  defaults: (newDefaults: {
    method: string;
    baseUrl: string;
    headers: {
      accept: string;
      'user-agent': string;
    };
    mediaType: {
      format: string;
      previews: string[];
    };
  }) => withDefaults;
  merge: (route: any, options?: any) => typeof import('./lib/defaults')
}

function withDefaults(oldDefaults: typeof import('./lib/defaults') | null, newDefaults: typeof import('./lib/defaults')): withDefaults {
  const DEFAULTS: typeof oldDefaults & typeof newDefaults = merge(oldDefaults, newDefaults)
  return Object.assign(endpointWithDefaults.bind(null, DEFAULTS), {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  })
}
