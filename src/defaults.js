import { getUserAgent } from "universal-user-agent";

import { VERSION } from "./version.js";

/** @typedef {import('@octokit/types').EndpointDefaults} EndpointDefaults */

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

/**
 * DEFAULTS has all properties set that EndpointOptions has, except url.
 * So we use RequestParameters and add method as additional required property.
 */
export const DEFAULTS = /** @type {EndpointDefaults} */ ({
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent,
  },
  mediaType: {
    format: "",
    /** @type {string[]} */
    previews: [],
  },
});
