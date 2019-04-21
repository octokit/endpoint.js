export = defaultOptions

import merge = require('deepmerge')
import isPlainObject = require('is-plain-object')

import lowercaseKeys = require('./util/lowercase-keys')

function defaultOptions (defaults: typeof import('./defaults') | null, route: string | {}, options?: any) {
  if (typeof route === 'string') {
    let [method, url] = route.split(' ')
    options = Object.assign(url ? { method, url } : { url: method }, options)
  } else {
    options = route || {}
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers)

  options = merge.all([defaults, options].filter(Boolean), { isMergeableObject: isPlainObject })

  // mediaType.previews arrays are merged, instead of overwritten
  if (defaults && defaults.mediaType.previews.length) {
    options.mediaType.previews = defaults.mediaType.previews.filter(preview => !options.mediaType.previews.includes(preview))
      .concat(options.mediaType.previews)
  }

  options.mediaType.previews = options.mediaType.previews.map((preview: string) => preview.replace(/-preview/, ''))

  return options
}
