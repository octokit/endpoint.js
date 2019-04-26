const endpoint = require("../lib");

describe("endpoint.parse()", () => {
  /*it("is a function", () => {
    expect(endpoint.parse).toBe("function");
  });*/

  it("README example", () => {
    const input = {
      method: "get",
      url: "/orgs/:org/repos",
      org: "octokit",
      type: "private"
    };

    expect(endpoint(input)).toEqual(
      endpoint.parse(endpoint.merge(input))
    );
  });

  it("does not alter input options", () => {
    const input = {
      method: "get",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json"
      },
      mediaType: {
        previews: ["foo", "bar"]
      }
    };

    endpoint.parse(input);

    expect(input.headers.accept).toEqual("application/vnd.github.v3+json");
  });
});
