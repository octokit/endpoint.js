import { Agent } from "node:http";

import { getUserAgent } from "universal-user-agent";

import { endpoint } from "../src/index.ts";
import { VERSION } from "../src/version.ts";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

describe("endpoint()", () => {
  it("is a function", () => {
    expect(endpoint).toBeInstanceOf(Function);
  });

  it("README example", () => {
    const options = endpoint({
      method: "GET",
      url: "/orgs/{org}/repos",
      org: "octokit",
      type: "private",
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/orgs/octokit/repos?type=private",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Pass route string as first argument", () => {
    const options = endpoint("GET /orgs/{org}/repos", {
      org: "octokit",
      type: "private",
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/orgs/octokit/repos?type=private",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Pass route string as first argument without options", () => {
    const options = endpoint("GET /");

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Custom user-agent header", () => {
    const options = endpoint("GET /", {
      headers: {
        // also test that header keys GET lowercased
        "User-Agent": "my-app/1.2.3",
      },
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "my-app/1.2.3",
      },
    });
  });

  it("Full URL", () => {
    const options = endpoint(
      "GET https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master",
    );

    expect(options).toEqual({
      method: "GET",
      url: "https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Should properly handle either placeholder format on url", () => {
    const { url: url1 } = endpoint(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "owner",
        repo: "repo",
        path: "path/to/file.txt",
      },
    );
    const { url: url2 } = endpoint(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "owner",
        repo: "repo",
        path: "path/to/file.txt",
      },
    );
    expect(url1).toEqual(url2);
  });

  it("Request body", () => {
    const options = endpoint("POST /repos/{owner}/{repo}/issues", {
      owner: "octocat",
      repo: "hello-world",
      headers: {
        accept: "text/html;charset=utf-8",
      },
      title: "Found a bug",
      body: "I'm having a problem with this.",
      assignees: ["octocat"],
      milestone: 1,
      labels: ["bug"],
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/repos/octocat/hello-world/issues",
      headers: {
        accept: "text/html;charset=utf-8",
        "content-type": "application/json; charset=utf-8",
        "user-agent": userAgent,
      },
      body: {
        assignees: ["octocat"],
        body: "I'm having a problem with this.",
        labels: ["bug"],
        milestone: 1,
        title: "Found a bug",
      },
    });
  });

  it("PUT without request body", () => {
    const options = endpoint("PUT /user/starred/{owner}/{repo}", {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
      },
      owner: "octocat",
      repo: "hello-world",
    });

    expect(options).toEqual({
      body: "",
      method: "PUT",
      url: "https://api.github.com/user/starred/octocat/hello-world",
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("DELETE without request body", () => {
    const options = endpoint("DELETE /user/following/{username}", {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
      },
      username: "octocat",
    });

    expect(options).toEqual({
      method: "DELETE",
      url: "https://api.github.com/user/following/octocat",
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("POST without request body", () => {
    const options = endpoint("POST /widgets", {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/widgets",
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("PATCH without request body", () => {
    const options = endpoint("PATCH /widgets/{id}", {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
      },
      id: "my-widget",
    });

    expect(options).toEqual({
      body: "",
      method: "PATCH",
      url: "https://api.github.com/widgets/my-widget",
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Query parameter template", () => {
    const options = endpoint(
      "POST https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}",
      {
        name: "example.zip",
        label: "short description",
        headers: {
          "content-type": "text/plain",
          "content-length": 14,
          authorization: `token 0000000000000000000000000000000000000001`,
        },
        data: "Hello, world!",
      },
    );

    expect(options).toEqual({
      method: "POST",
      url: "https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets?name=example.zip&label=short%20description",
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `token 0000000000000000000000000000000000000001`,
        "content-type": "text/plain",
        "content-length": 14,
        "user-agent": userAgent,
      },
      body: "Hello, world!",
    });
  });

  it("URL with query parameter and additional options", () => {
    const options = endpoint("GET /orgs/octokit/repos?access_token=abc4567", {
      type: "private",
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/orgs/octokit/repos?access_token=abc4567&type=private",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Set request body directly", () => {
    const options = endpoint("POST /markdown/raw", {
      data: "Hello world github/linguist#1 **cool**, and #1!",
      headers: {
        accept: "text/html;charset=utf-8",
        "content-type": "text/plain",
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/markdown/raw",
      headers: {
        accept: "text/html;charset=utf-8",
        "content-type": "text/plain",
        "user-agent": userAgent,
      },
      body: "Hello world github/linguist#1 **cool**, and #1!",
    });
  });

  it("Encode q parameter", () => {
    const options = endpoint("GET /search/issues", {
      q: "location:Jyväskylä",
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/search/issues?q=location%3AJyv%C3%A4skyl%C3%A4",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("request parameter", () => {
    const options = endpoint("GET /", {
      request: {
        timeout: 100,
      },
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
      request: {
        timeout: 100,
      },
    });
  });

  it("request.agent", () => {
    const options = endpoint("GET /", {
      request: {
        agent: new Agent(),
      },
    });

    expect(options.request!.agent).toBeInstanceOf(Agent);
  });

  it("Just URL", () => {
    expect(endpoint("/").url).toEqual("https://api.github.com/");
    expect(endpoint("/").method).toEqual("GET");
    expect(endpoint("https://github.acme-inc/api/v3/").url).toEqual(
      "https://github.acme-inc/api/v3",
    );
  });

  it("options.mediaType.previews is undefined", () => {
    const options = endpoint({
      method: "POST",
      url: "/graphql",
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/graphql",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("options.mediaType.format", () => {
    const options = endpoint({
      method: "GET",
      url: "/repos/{owner}/{repo}/issues/{number}",
      mediaType: {
        format: "raw",
      },
      owner: "octokit",
      repo: "endpoint.js",
      number: 123,
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
      headers: {
        accept: "application/vnd.github.v3.raw",
        "user-agent": userAgent,
      },
    });
  });

  it("options.mediaType.previews", () => {
    const options = endpoint({
      method: "POST",
      url: "/graphql",
      mediaType: {
        previews: ["symmetra"],
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/graphql",
      headers: {
        accept: "application/vnd.github.symmetra-preview+json",
        "user-agent": userAgent,
      },
    });
  });

  it("options.mediaType.previews with -preview suffix", () => {
    const options = endpoint({
      method: "POST",
      url: "/graphql",
      mediaType: {
        previews: ["jean-grey-preview", "symmetra-preview"],
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/graphql",
      headers: {
        accept:
          "application/vnd.github.jean-grey-preview+json,application/vnd.github.symmetra-preview+json",
        "user-agent": userAgent,
      },
    });
  });

  it("options.mediaType.format + options.mediaType.previews", () => {
    const options = endpoint({
      method: "POST",
      url: "/graphql",
      mediaType: {
        format: "raw",
        previews: ["symmetra"],
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/graphql",
      headers: {
        accept: "application/vnd.github.symmetra-preview.raw",
        "user-agent": userAgent,
      },
    });
  });

  it("options.mediaType.format + options.mediaType.previews + accept header", () => {
    const options = endpoint({
      method: "POST",
      url: "/graphql",
      headers: {
        accept: "application/vnd.foo-preview,application/vnd.bar-preview",
      },
      mediaType: {
        format: "raw",
        previews: ["symmetra"],
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/graphql",
      headers: {
        accept:
          "application/vnd.github.foo-preview.raw,application/vnd.github.bar-preview.raw,application/vnd.github.symmetra-preview.raw",
        "user-agent": userAgent,
      },
    });
  });

  it("application/octet-stream accept header + previews", () => {
    const options = endpoint({
      method: "POST",
      url: "/graphql",
      headers: {
        accept: "application/octet-stream",
      },
      mediaType: {
        previews: ["symmetra"],
      },
    });

    expect(options).toEqual({
      method: "POST",
      url: "https://api.github.com/graphql",
      headers: {
        accept: "application/octet-stream",
        "user-agent": userAgent,
      },
    });
  });

  it("Undefined query parameter", () => {
    const options = endpoint({
      method: "GET",
      url: "/notifications",
      before: undefined,
    });

    expect(options).toEqual({
      method: "GET",
      url: "https://api.github.com/notifications",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Undefined placeholder value with no trailing slash in URL", () => {
    const options1 = endpoint("GET /repos/{owner}/{repo}/branches/{branch}", {
      owner: "owner",
      repo: "repo",
    });

    expect(options1).toEqual({
      method: "GET",
      url: "https://api.github.com/repos/owner/repo/branches",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });

    const options2 = endpoint("GET /repos/{owner}/{repo}/branches{/branch}", {
      owner: "owner",
      repo: "repo",
    });

    expect(options2).toEqual({
      method: "GET",
      url: "https://api.github.com/repos/owner/repo/branches",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Trailing slash in URL in expression is encoded", () => {
    const options1 = endpoint(
      "GET /repos/{owner}/{repo}/git/matching-refs/{ref}",
      {
        owner: "owner",
        repo: "repo",
        ref: "heads/",
      },
    );

    expect(options1).toEqual({
      method: "GET",
      url: "https://api.github.com/repos/owner/repo/git/matching-refs/heads%2F",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });

    const options2 = endpoint("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "owner",
      repo: "repo",
      path: "my-folder/",
      ref: "feature/branch",
    });

    expect(options2).toEqual({
      method: "GET",
      url: "https://api.github.com/repos/owner/repo/contents/my-folder%2F?ref=feature%2Fbranch",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    });
  });

  it("Undefined header value", () => {
    const options = endpoint({
      method: "GET",
      url: "/notifications",
      headers: {
        "if-modified-since": undefined,
      },
    });

    expect(options).not.toHaveProperty("headers.if-modified-since");
  });
});
