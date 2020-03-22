export function omit(
  object: { [key: string]: any },
  keysToOmit: string[]
): { [key: string]: any } {
  return Object.keys(object)
    .filter((option) => !keysToOmit.includes(option))
    .reduce((obj: { [key: string]: any }, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
}
