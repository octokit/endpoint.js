export = withDefaults

import endpointWithDefaults = require('./endpoint-with-defaults')
import merge = require('./merge')
import parse = require('./parse')

interface withDefaults {
  (route: any, options: any): any
  DEFAULTS: (typeof import('./defaults') | null) & any
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
  merge: (route: any, options?: any) => typeof import('./defaults')
}

function withDefaults (oldDefaults: typeof import('./defaults') | null, newDefaults: typeof import('./defaults')): withDefaults {
  const DEFAULTS: typeof oldDefaults & typeof newDefaults = merge(oldDefaults, newDefaults)
  return Object.assign(endpointWithDefaults.bind(null, DEFAULTS), {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  })
}
