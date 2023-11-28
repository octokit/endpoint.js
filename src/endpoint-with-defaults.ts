import type { EndpointOptions, RequestParameters, Route } from "@octokit/types";

import { DEFAULTS } from "./defaults.js";
import { merge } from "./merge.js";
import { parse } from "./parse.js";

export function endpointWithDefaults(
  defaults: typeof DEFAULTS,
  route: Route | EndpointOptions,
  options?: RequestParameters,
) {
  return parse(merge(defaults, route, options));
}
