import { EndpointOptions, RequestParameters, Route } from "@octokit/types";

import { DEFAULTS } from "./defaults";
import { merge } from "./merge";
import { parse } from "./parse";

export function endpointWithDefaults(
  defaults: typeof DEFAULTS,
  route: Route | EndpointOptions,
  options?: RequestParameters
) {
  return parse(merge(defaults, route, options));
}
