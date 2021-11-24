/** @param {{ [key: string]: any }} object  */
export function lowercaseKeys(object = {}) {
  return Object.keys(object).reduce(
    (/** @type {{ [key: string]: any }} */ newObj, key) => {
      newObj[key.toLowerCase()] = object[key];
      return newObj;
    },
    {}
  );
}
