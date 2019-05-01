// TODO: actually generate the contents of this file :)

import { Url, Headers, EndpointRequestOptions } from "../types";

export interface Routes {
  "GET /": [GetRootOptions, GetRootRequestOptions];
}

type GetRootOptions = {};
type GetRootRequestOptions = {
  method: "GET";
  url: "/";
  headers: Headers;
  request: EndpointRequestOptions;
};
