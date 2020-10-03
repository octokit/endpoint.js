export function removeUndefinedProperties(obj: any): any {
  const copy = Object.assign({}, obj);
  for (const key in copy) {
    if (copy[key] === undefined) {
      delete copy[key];
    }
  }
  return copy;
}
