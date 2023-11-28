import { withDefaults } from "./with-defaults.js";
import { DEFAULTS } from "./defaults.js";

export const endpoint = withDefaults(null, DEFAULTS);

fetch("https://api.github.com/users/octocat", {
  headers: {
    accept: "application/vnd.github.v3+json",
  },
  method: "GET",
})