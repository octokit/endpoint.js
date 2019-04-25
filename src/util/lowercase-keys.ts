export function lowercaseKeys(object?: { [key: string]: any }) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj: { [key: string]: any }, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}
