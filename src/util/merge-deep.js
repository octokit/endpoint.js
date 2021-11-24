import { isPlainObject } from "is-plain-object";

/**
 * @param {any} defaults
 * @param {any} options
 * @returns {object}
 */
export function mergeDeep(defaults, options) {
  const result = { ...defaults };

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
