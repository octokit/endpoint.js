import type {
  EndpointInterface,
  RequestParameters,
  EndpointDefaults,
} from "@octokit/types";

import { endpointWithDefaults } from "./endpoint-with-defaults.js";
import { merge } from "./merge.js";
import { parse } from "./parse.js";

export function withDefaults(
  oldDefaults: EndpointDefaults | null,
  newDefaults: RequestParameters,
): EndpointInterface {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);

  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse,
  }) as EndpointInterface<typeof oldDefaults & typeof newDefaults>;
}
