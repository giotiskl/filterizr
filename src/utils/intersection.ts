/**
 * A function get the intersection of two arrays. IE9+.
 */
export const intersection = (arr1: any[], arr2: any[]): any[] => {
  return Array.prototype.filter.call(arr1, (n: any): boolean =>
    arr2.includes(n)
  );
};
