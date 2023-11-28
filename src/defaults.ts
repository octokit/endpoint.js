import { getUserAgent } from "universal-user-agent";
import type { EndpointDefaults } from "@octokit/types";

import { VERSION } from "./version.js";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
export const DEFAULTS: EndpointDefaults = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent,
  },
  mediaType: {
    format: "",
  },
};
