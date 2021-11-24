import { merge } from "./merge.js";
import { parse } from "./parse.js";

/** @typedef {import('@octokit/types').Route} Route */
/** @typedef {import('@octokit/types').RequestParameters} RequestParameters */
/** @typedef {import('@octokit/types').EndpointOptions} EndpointOptions */
/** @typedef {import('@octokit/types').EndpointDefaults} EndpointDefaults */
/** @typedef {import('./defaults.js').DEFAULTS} DEFAULTS */

/**
 * @param {DEFAULTS} defaults
 * @param {Route | EndpointOptions} route
 * @param {RequestParameters} [options]
 */
export function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
