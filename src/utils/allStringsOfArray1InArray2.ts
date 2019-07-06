export const allStringsOfArray1InArray2 = (
  arr1: string[],
  arr2: string[]
): boolean =>
  arr1.reduce((acc, item): boolean => acc && arr2.includes(item), true);
