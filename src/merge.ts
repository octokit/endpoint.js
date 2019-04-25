import deepmerge from 'deepmerge'
import isPlainObject from 'is-plain-object'

import { EndpointDefaultOptions, Route, RouteOptions } from './types'
import { lowercaseKeys } from './util/lowercase-keys'

type Defaults = EndpointDefaultOptions | null

export function merge (defaults: Defaults, route: Route | RouteOptions, options?: RouteOptions) {
  if (typeof route === 'string') {
    let [method, url] = route.split(' ')
    options = Object.assign(url ? { method, url } : { url: method }, options)
  } else {
    options = route || {}
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers)

  const mergedOptions = deepmerge.all([defaults!, options].filter(Boolean), { isMergeableObject: isPlainObject }) as EndpointDefaultOptions

  // mediaType.previews arrays are merged, instead of overwritten
  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview))
      .concat(mergedOptions.mediaType.previews)
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview: string) => preview.replace(/-preview/, ''))

  return mergedOptions
}
