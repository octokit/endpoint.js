import { getUserAgent } from "universal-user-agent";
import { EndpointDefaults } from "@octokit/types";

import { VERSION } from "./version";

const DEFAULT_API_VERSION = "2022-08-09";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
export const DEFAULTS: EndpointDefaults = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent,
    "x-github-api-version": DEFAULT_API_VERSION,
  },
  mediaType: {
    format: "",
    previews: [] as string[],
  },
};
