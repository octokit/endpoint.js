import { merge } from "./merge";
import { parse } from "./parse";
import { Defaults, Endpoint, RequestOptions, Route, Parameters } from "./types";

export function endpointWithDefaults(
  defaults: Defaults,
  route: Route | Endpoint,
  options?: Parameters
) {
  return parse(merge(defaults, route, options));
}
