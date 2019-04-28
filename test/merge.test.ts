import getUserAgent from "universal-user-agent";

import { endpoint } from "../src";
import { VERSION } from "../src/version";
const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

describe("endpoint.merge()", () => {
  it("is a function", () => {
    expect(endpoint.merge).toBeInstanceOf(Function);
  });

  it("README example", () => {
    const myProjectEndpoint = endpoint.defaults({
      baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
      headers: {
        "user-agent": "myApp/1.2.3"
      },
      org: "my-project"
    });
    const options = myProjectEndpoint.merge("GET /orgs/:org/repos", {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`
      },
      type: "private"
    });

    expect(options).toEqual({
      baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
      mediaType: {
        format: "",
        previews: []
      },
      method: "GET",
      url: "/orgs/:org/repos",
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `token 0000000000000000000000000000000000000001`,
        "user-agent": "myApp/1.2.3"
      },
      org: "my-project",
      type: "private"
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

    const options = myProjectEndpointWithAuth.merge(`GET /orgs/:org/repos`);

    expect(options).toEqual({
      baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
      mediaType: {
        format: "",
        previews: []
      },
      method: "GET",
      url: "/orgs/:org/repos",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp/1.2.3",
        authorization: `token 0000000000000000000000000000000000000001`
      },
      org: "my-project"
    });
  });

  it("no arguments", () => {
    const options = endpoint.merge();
    expect(options).toStrictEqual({
      baseUrl: "https://api.github.com",
      mediaType: {
        format: "",
        previews: []
      },
      method: "GET",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent
      }
    });
  });
});
