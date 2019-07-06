/**
 * Set inline styles on an HTML node
 * @param {HTMLElement} node - HTML node
 * @param {Object} styles - object with styles
 * @returns {undefined}
 */
export function setStyles(node: Element, styles: any): void {
  Object.entries(styles).forEach(([key, value]): void => {
    ((node as HTMLElement).style as any)[key] = value;
  });
}
