import { merge } from "./merge";
import { parse } from "./parse";
import {
  EndpointDefaultOptions,
  EndpointOptions,
  RequestOptions,
  Route,
  RouteOptions
} from "./types";

export function endpointWithDefaults(
  defaults: EndpointDefaultOptions,
  route: Route | EndpointOptions,
  options?: RouteOptions
) {
  return parse(merge(defaults, route, options));
}
