/**
 * Wrapper around document.querySelector, will function as
 * an identity function if an HTML element is passed in
 * @param {HTMLElement|string} nodeOrSelector
 */
export const getHTMLElement = (
  selectorOrNode: HTMLElement | string
): HTMLElement => {
  if (typeof selectorOrNode === 'string') {
    return document.querySelector(selectorOrNode);
  }
  return selectorOrNode;
};
