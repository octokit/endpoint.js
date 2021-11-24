import { lowercaseKeys } from "./util/lowercase-keys.js";
import { mergeDeep } from "./util/merge-deep.js";
import { removeUndefinedProperties } from "./util/remove-undefined-properties.js";

/** @typedef {import('@octokit/types').EndpointDefaults} EndpointDefaults */
/** @typedef {import('@octokit/types').Route} Route */
/** @typedef {import('@octokit/types').RequestParameters} RequestParameters */

/**
 * @param {EndpointDefaults | null} defaults
 * @param {Route | RequestParameters} [route]
 * @param {RequestParameters} [options]
 */
export function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers);

  // remove properties with undefined values before merging
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);

  const mergedOptions = /** @type {EndpointDefaults} */ (
    mergeDeep(defaults || {}, options)
  );

  // mediaType.previews arrays are merged, instead of overwritten
  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews
      .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
      .concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(
    (preview) => preview.replace(/-preview/, "")
  );

  return mergedOptions;
}
