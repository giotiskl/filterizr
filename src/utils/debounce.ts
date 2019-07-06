/**
 * Debounce of Underscore.js
 */
export const debounce = function(
  func: Function,
  wait: number,
  immediate: boolean
): Function {
  let timeout: number;
  return function(): void {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = window.setTimeout((): void => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};
