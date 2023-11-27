export function omit(
  object: { [key: string]: any },
  keysToOmit: string[],
): { [key: string]: any } {
  const result: { [key: string]: any } = { __proto__: null };

  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }

  return result;
}
