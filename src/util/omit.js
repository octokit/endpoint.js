/**
 * @param {{ [key: string]: any }} object
 * @param {string[]} keysToOmit
 */
export function omit(object, keysToOmit) {
  return Object.keys(object)
    .filter((option) => !keysToOmit.includes(option))
    .reduce((/** @type {{ [key: string]: any }} */ obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
}
