import getUserAgent from "universal-user-agent";

import { Defaults } from "./types";
import { VERSION } from "./version";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

export const DEFAULTS: Defaults = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: [] as string[]
  }
};
