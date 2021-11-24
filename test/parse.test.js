/** @typedef {import("@octokit/types").EndpointDefaults} EndpointDefaults */
/** @typedef {import("@octokit/types").EndpointOptions} EndpointOptions */

import { endpoint } from "../src/index.js";

describe("endpoint.parse()", () => {
  it("is a function", () => {
    expect(endpoint.parse).toBeInstanceOf(Function);
  });

  it("README example", () => {
    /** @type {EndpointOptions} */
    const input = {
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
        previews: [],
      },
    });
    expect(url).toEqual("https://example.com/");
  });

  it("does not alter input options", () => {
    /** @type {EndpointDefaults} */
    const input = {
      baseUrl: "https://api.github.com/v3",
      method: "GET",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp v1.2.3",
      },
      mediaType: {
        format: "",
        previews: ["foo", "bar"],
      },
    };

    endpoint.parse(input);

    expect(input.headers.accept).toEqual("application/vnd.github.v3+json");
  });
});
