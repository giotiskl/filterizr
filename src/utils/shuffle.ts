/**
 * Fisher-Yates shuffle ES6 non-mutating implementation.
 * @param {Array<T>} array the array to shuffle
 * @return {Array<T>} shuffled array without mutating the initial array, but with the same element reference.
 * @template {T}
 */
export const shuffle = <T>(array: T[]): T[] => {
  // perform shallow clone on array to mutate
  let cloned = array.slice();
  // array to return
  let randomizedArray = [];
  // perform shuffle
  while (cloned.length !== 0) {
    let rIndex = Math.floor(cloned.length * Math.random());
    randomizedArray.push(cloned[rIndex]);
    cloned.splice(rIndex, 1);
  }
  return randomizedArray;
};
