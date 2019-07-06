/**
 * Simple non-mutating sorting function for arrays of objects by a property
 * @param {Array} array to sort
 * @param {Function} propFn fetches the property by which to sort
 * @return {Array} a new sorted array
 */
export const sortBy = (array: any[], propFn: Function): any[] => {
  let cloned = array.slice(0); // perform deep copy of array

  const comparator = (propFn: Function) => {
    return (a: any, b: any): number => {
      const propA = propFn(a);
      const propB = propFn(b);
      if (propA < propB) {
        return -1;
      } else if (propA > propB) {
        return 1;
      } else {
        return 0;
      }
    };
  };

  return cloned.sort(comparator(propFn));
};
