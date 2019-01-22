export = function lowercaseKeys (object?: any) {
  if (!object) {
    return {}
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key]
    return newObj
  }, {})
}
