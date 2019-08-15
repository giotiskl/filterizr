/**
 * Set inline styles on an HTML node
 * @param {HTMLElement} node - HTML node
 * @param {Object} styles - object with styles
 * @returns {void}
 */
export function setStyles(node: HTMLElement, styles: any): void {
  Object.entries(styles).forEach(([key, value]): void => {
    (node.style as any)[key] = value;
  });
}
