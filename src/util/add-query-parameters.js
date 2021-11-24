/**
 * @param {string} url
 * @param {{ [x: string]: string | undefined; q?: string }} parameters
 */
export function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return (
    url +
    separator +
    names
      .map((name) => {
        if (name === "q") {
          return (
            // @ts-ignore
            "q=" + parameters.q.split("+").map(encodeURIComponent).join("+")
          );
        }

        // @ts-ignore
        return `${name}=${encodeURIComponent(parameters[name])}`;
      })
      .join("&")
  );
}
