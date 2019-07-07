import { Dictionary } from '../types/interfaces/Dictionary';

/**
 * Simple object check.
 */
function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 */
export function merge(
  target: Dictionary,
  ...sources: Dictionary[]
): Dictionary {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}
