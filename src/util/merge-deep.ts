import { isPlainObject } from "./is-plain-object.js";

export function mergeDeep(defaults: any, options: any): object {
  const result = Object.assign({}, defaults);

  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });

  return result;
}
