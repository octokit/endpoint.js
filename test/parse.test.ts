import { EndpointOptions, EndpointDefaults } from "@octokit/types";

import { endpoint } from "../src";

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

  it("parses previews for /graphql endpoint", () => {
    const input: EndpointDefaults = {
      baseUrl: "https://api.github.com/",
      method: "POST",
      url: "/graphql",
      headers: {
        accept: "application/json",
        "user-agent": "myApp v1.2.3",
      },
      mediaType: {
        format: "json",
        previews: ["package-deletes", "flash-preview"],
      },
    };

    endpoint.parse(input);

    expect(input.headers.accept).toEqual(
      "application/vnd.github.package-deletes-preview+json,application/vnd.github.flash-preview+json"
    );
  });
});
