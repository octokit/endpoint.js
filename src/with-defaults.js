import { endpointWithDefaults } from "./endpoint-with-defaults.js";
import { merge } from "./merge.js";
import { parse } from "./parse.js";

/** @typedef {import('@octokit/types').EndpointInterface} EndpointInterface */
/** @typedef {import('@octokit/types').RequestParameters} RequestParameters */
/** @typedef {import('@octokit/types').EndpointDefaults} EndpointDefaults */

/**
 * @param {(EndpointDefaults | null)} oldDefaults
 * @param {RequestParameters} newDefaults
 * @returns {EndpointInterface}
 */
export function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);

  return /** @type {EndpointInterface} */ (
    Object.assign(endpoint, {
      DEFAULTS,
      defaults: withDefaults.bind(null, DEFAULTS),
      merge: merge.bind(null, DEFAULTS),
      parse,
    })
  );
}

class f {}
