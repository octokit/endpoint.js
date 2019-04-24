export interface endpoint {
  (route: Route, options?: RouteOptions): RequestOptions;
  (options: EndpointOptions): RequestOptions;
  DEFAULTS: EndpointDefaultOptions;
  defaults: (newDefaults: RouteOptions) => endpoint;
  merge: {
    /**
     * Merges current endpoint defaults with passed route and parameters,
     * without transforming them into request options.
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
     * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     *
     */
    (route: Route, parameters?: Parameters): Defaults;

    /**
     * Merges current endpoint defaults with passed route and parameters,
     * without transforming them into request options.
     *
     * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    (options: Parameters): Defaults;

    /**
     * Returns current default options.
     *
     * @deprecated use endpoint.DEFAULTS instead
     */
    (): Defaults;
  };

  /**
   * Stateless method to turn endpoint options into request options.
   * Calling `endpoint(options)` is the same as calling `endpoint.parse(endpoint.merge(options))`.
   *
   * @param {object} options `method`, `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  parse: (options: Defaults) => RequestOptions;
}

export type Route = string;

export type Method = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";

export type RouteOptions = {
  baseUrl?: string;
  headers?: {
    accept?: string;
    authorization?: string;
    "user-agent"?: string;
    [header: string]: string | number | undefined;
  };
  mediaType?: {
    format?: string;
    previews?: string[];
  };
  request?: {
    [option: string]: any;
  };
  [option: string]: any;
};

export type EndpointOptions = RouteOptions & {
  method: Method;
};

export type EndpointDefaultOptions = RouteOptions & {
  method: Method;
  baseUrl: string;
  headers: {
    accept: string;
    "user-agent": string;
  };
  mediaType: {
    format: string;
    previews: string[];
  };
};

export type RequestOptions = {
  method: Method;
  url: string;
  headers: {
    accept: string;
    "user-agent": string;
    [option: string]: any;
  };
  body?: any;
  request?: {
    [option: string]: any;
  };
};
