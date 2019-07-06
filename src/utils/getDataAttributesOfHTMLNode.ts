import { Dictionary } from '../types/interfaces/Dictionary';

export function getDataAttributesOfHTMLNode(node: Element) {
  const data: Dictionary = {
    category: '',
    sort: '',
  };
  for (let i = 0, atts = node.attributes, n = atts.length; i < n; i++) {
    const { nodeName, nodeValue } = atts[i];
    if (nodeName.includes('data')) {
      data[nodeName.slice(5, nodeName.length)] = nodeValue;
    }
  }
  delete data.category;
  delete data.sort;
  return data;
}
