import { endpoint } from "../src";
import { Defaults, Endpoint } from "../src/types";

describe("endpoint.parse()", () => {
  it("is a function", () => {
    expect(endpoint.parse).toBeInstanceOf(Function);
  });

  it("README example", () => {
    const input: Endpoint = {
      method: "GET",
      url: "/orgs/:org/repos",
      org: "octokit",
      type: "private"
    };

    expect(endpoint(input)).toEqual(endpoint.parse(endpoint.merge(input)));
  });

  it("does not alter input options", () => {
    const input: Defaults = {
      baseUrl: "https://api.github.com/v3",
      method: "GET",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp v1.2.3"
      },
      mediaType: {
        format: "",
        previews: ["foo", "bar"]
      }
    };

    endpoint.parse(input);

    expect(input.headers.accept).toEqual("application/vnd.github.v3+json");
  });
});
