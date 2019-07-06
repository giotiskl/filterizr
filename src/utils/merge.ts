import { Dictionary } from '../types/interfaces/Dictionary';

/**
 * Non-mutating merge of objects
 * @param old is the old object from which the missing props are copied.
 * @param target is the target object with the updated values.
 */
export const merge = (old: Dictionary, target: Dictionary): Dictionary => {
  const merged = Object.assign({}, old, target);
  Object.entries(merged).forEach(([key, value]): void => {
    const isObject =
      typeof value === 'object' && value !== null && !(value instanceof Date);
    if (isObject) {
      merged[key] = merge(old[key], target[key]);
    }
  });
  return merged;
};
