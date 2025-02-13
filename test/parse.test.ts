import { describe, it, expect } from "vitest";
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

  it("Test ReDoS - attack string #1", async () => {
    const startTime = performance.now();
    try {
      endpoint.parse({
        method: "POST",
        url: "/graphql", // Ensure that the URL ends with "/graphql"
        headers: {
          accept: "" + "A".repeat(100000) + "-", // Pass in the attack string
          "content-type": "text/plain",
          "user-agent": "Your User Agent String Here",
        },
        mediaType: {
          previews: ["test-preview"], // Ensure that mediaType.previews exists and has values
          format: "raw", // Optional media format
        },
        baseUrl: "https://api.github.com",
      });
    } catch (error) {
      // pass
    }
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    const reDosThreshold = 2000; 

    expect(elapsedTime).toBeLessThanOrEqual(reDosThreshold);
    if (elapsedTime > reDosThreshold) {
      console.warn(`🚨 Potential ReDoS Attack! getDuration method took ${elapsedTime.toFixed(2)} ms, exceeding threshold of ${reDosThreshold} ms.`);
    }
  });

  it("Test ReDoS - attack string #2", async () => {
    const startTime = performance.now();
    try {
      endpoint.parse({
        method: "POST",
        url: "{".repeat(100000) + "@", // Pass in the attack string
        headers: {
          accept: "application/vnd.github.v3+json",
          "content-type": "text/plain",
          "user-agent": "Your User Agent String Here",
        },
        mediaType: {
          previews: ["test-preview"], // Ensure that mediaType.previews exists and has values
          format: "raw", // Optional media format
        },
        baseUrl: "https://api.github.com",
      });
    } catch (error) {
      // pass
    }
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    const reDosThreshold = 2000; 

    expect(elapsedTime).toBeLessThanOrEqual(reDosThreshold);
    if (elapsedTime > reDosThreshold) {
      console.warn(`🚨 Potential ReDoS Attack! getDuration method took ${elapsedTime.toFixed(2)} ms, exceeding threshold of ${reDosThreshold} ms.`);
    }
  });

  it("Test ReDoS - attack string #3", async () => {
    const startTime = performance.now();
    try {
      endpoint.parse({
        method: "POST",
        url: "{"+"00"+"\u0000".repeat(100000)+"a!a"+"}", // Pass in the attack string
        headers: {
          accept: "application/vnd.github.v3+json",
          "content-type": "text/plain",
          "user-agent": "Your User Agent String Here",
        },
        mediaType: {
          previews: ["test-preview"],
          format: "raw",
        },
        baseUrl: "https://api.github.com",
      });
    } catch (error) {
      // pass
    }
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    const reDosThreshold = 2000; 

    expect(elapsedTime).toBeLessThanOrEqual(reDosThreshold);
    if (elapsedTime > reDosThreshold) {
      console.warn(`🚨 Potential ReDoS Attack! getDuration method took ${elapsedTime.toFixed(2)} ms, exceeding threshold of ${reDosThreshold} ms.`);
    }
  });
});
