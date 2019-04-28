import { endpoint } from "../src";

describe("endpoint.defaults()", () => {
  it("is a function", () => {
    expect(endpoint.defaults).toBeInstanceOf(Function);
  });

  it("README example", () => {
    const myEndpoint = endpoint.defaults({
      baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
      headers: {
        "user-agent": "myApp/1.2.3",
        authorization: `token 0000000000000000000000000000000000000001`
      },
      org: "my-project",
      per_page: 100
    });

    const options = myEndpoint(`GET /orgs/:org/repos`);

    expect(options).toEqual({
      method: "GET",
      url:
        "https://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos?per_page=100",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp/1.2.3",
        authorization: `token 0000000000000000000000000000000000000001`
      }
    });
  });

  it("repeated defaults", () => {
    const myProjectEndpoint = endpoint.defaults({
      baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
      headers: {
        "user-agent": "myApp/1.2.3"
      },
      org: "my-project"
    });
    const myProjectEndpointWithAuth = myProjectEndpoint.defaults({
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`
      }
    });

    const options = myProjectEndpointWithAuth(`GET /orgs/:org/repos`);

    expect(options).toEqual({
      method: "GET",
      url:
        "https://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp/1.2.3",
        authorization: `token 0000000000000000000000000000000000000001`
      }
    });
  });

  it(".DEFAULTS", () => {
    expect(endpoint.DEFAULTS.baseUrl).toEqual("https://api.github.com");
    const myEndpoint = endpoint.defaults({
      baseUrl: "https://github-enterprise.acme-inc.com/api/v3"
    });
    expect(myEndpoint.DEFAULTS.baseUrl).toEqual(
      "https://github-enterprise.acme-inc.com/api/v3"
    );
  });

  it(".defaults() merges options but does not yet parse", () => {
    const myEndpoint = endpoint.defaults({
      url: "/orgs/:org",
      org: "test1"
    });
    expect(myEndpoint.DEFAULTS.url).toEqual("/orgs/:org");
    expect(myEndpoint.DEFAULTS.org).toEqual("test1");
    const myEndpoint2 = myEndpoint.defaults({
      url: "/orgs/:org",
      org: "test2"
    });
    expect(myEndpoint2.DEFAULTS.url).toEqual("/orgs/:org");
    expect(myEndpoint2.DEFAULTS.org).toEqual("test2");
  });

  it(".defaults() sets mediatType.format", () => {
    const myEndpoint = endpoint.defaults({
      mediaType: {
        format: "raw"
      }
    });
    expect(myEndpoint.DEFAULTS.mediaType).toEqual({
      format: "raw",
      previews: []
    });
  });

  it(".defaults() merges mediatType.previews", () => {
    const myEndpoint = endpoint.defaults({
      mediaType: {
        previews: ["foo"]
      }
    });
    const myEndpoint2 = myEndpoint.defaults({
      mediaType: {
        previews: ["bar"]
      }
    });

    expect(myEndpoint.DEFAULTS.mediaType).toEqual({
      format: "",
      previews: ["foo"]
    });
    expect(myEndpoint2.DEFAULTS.mediaType).toEqual({
      format: "",
      previews: ["foo", "bar"]
    });
  });

  it('.defaults() merges mediatType.previews with "-preview" suffix', () => {
    const myEndpoint = endpoint.defaults({
      mediaType: {
        previews: ["foo-preview"]
      }
    });
    const myEndpoint2 = myEndpoint.defaults({
      mediaType: {
        previews: ["bar-preview"]
      }
    });

    expect(myEndpoint.DEFAULTS.mediaType).toEqual({
      format: "",
      previews: ["foo"]
    });
    expect(myEndpoint2.DEFAULTS.mediaType).toEqual({
      format: "",
      previews: ["foo", "bar"]
    });
  });
});
