export interface endpoint {
  (route: Route, options?: RouteOptions): RequestOptions
  (options: EndpointOptions): RequestOptions
  DEFAULTS: EndpointDefaultOptions
  defaults: (newDefaults: RouteOptions) => endpoint
  merge: {
    (route: Route, options?: RouteOptions): EndpointDefaultOptions
    (options: RouteOptions): EndpointDefaultOptions
  }
  parse: (options: EndpointDefaultOptions) => RequestOptions
}

export type Route = string

export type Method =
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'PATCH'
    | 'POST'
    | 'PUT'

export type RouteOptions = {
  baseUrl?: string
  headers?: {
    accept?: string
    authorization?: string
    'user-agent'?: string
    [header: string]: string | number | undefined
  }
  mediaType?: {
    format?: string
    previews?: string[]
  }
  request?: {
    [option: string]: any
  }
  [option: string]: any
}

export type EndpointOptions = RouteOptions & {
  method: Method
}

export type EndpointDefaultOptions = RouteOptions & {
  method: Method,
  baseUrl: string,
  headers: {
    accept: string,
    'user-agent': string
  },
  mediaType: {
    format: string,
    previews: string[]
  }
}

export type RequestOptions = {
  method: Method
  url: string
  headers: {
    accept: string
    'user-agent': string
    [option: string]: any
  }
  body?: any
  request?: {
    [option: string]: any
  }
}
