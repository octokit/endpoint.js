import type { EndpointOptions, EndpointDefaults } from "@octokit/types";

import { endpoint } from "../src/index.ts";

describe("endpoint.parse()", () => {
  it("is a function", () => {
    expect(endpoint.parse).toBeInstanceOf(Function);
  });

  it("README example", () => {
    const input: EndpointOptions = {
      method: "GET",
      url: "/orgs/{org}/repos",
      org: "octokit",
      type: "private",
    };

    expect(endpoint(input)).toEqual(endpoint.parse(endpoint.merge(input)));
  });

  it("defaults url to ''", () => {
    const { url } = endpoint.parse({
      method: "GET",
      baseUrl: "https://example.com",
      headers: {
        accept: "foo",
        "user-agent": "bar",
      },
      mediaType: {
        format: "",
      },
    });
    expect(url).toEqual("https://example.com/");
  });

  it("does not alter input options", () => {
    const input: EndpointDefaults = {
      baseUrl: "https://api.github.com/v3",
      method: "GET",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp v1.2.3",
      },
      mediaType: {
        format: "",
      },
    };

    endpoint.parse(input);

    expect(input.headers.accept).toEqual("application/vnd.github.v3+json");
  });
});
