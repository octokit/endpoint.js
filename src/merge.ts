import { EndpointDefaults, RequestParameters, Route } from "@octokit/types";

import { lowercaseKeys } from "./util/lowercase-keys";
import { mergeDeep } from "./util/merge-deep";
import { removeUndefinedProperties } from "./util/remove-undefined-properties";

export function merge(
  defaults: EndpointDefaults | null,
  route?: Route | RequestParameters,
  options?: RequestParameters
) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers);

  // remove properties with undefined values before merging
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);

  const mergedOptions = mergeDeep(defaults || {}, options) as EndpointDefaults;

  return mergedOptions;
}
