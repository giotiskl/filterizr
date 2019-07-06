import FilterItem from '../FilterItem';

/**
 * Simple method to check if two arrays of FilterItems
 * are sorted in the same manner or not.
 * @param {Array} arr1 the first array of FilterItems
 * @param {Array} arr2 the second array of FilterItems
 * @return {Boolean} equality
 */
export const filterItemArraysHaveSameSorting = (
  filterItemsA: FilterItem[],
  filterItemsB: FilterItem[]
): boolean => {
  if (filterItemsA.length !== filterItemsB.length) {
    return false;
  }

  return filterItemsA.reduce((acc, filterItemA, index): boolean => {
    const indexA = filterItemA.getSortAttribute('index');
    const indexB = filterItemsB[index].getSortAttribute('index');
    return acc && indexA === indexB;
  }, true);
};
