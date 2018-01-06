/**
 * A simple function to check if an array of strings includes a certain value.
 * @param {array} arr is the array of string
 * @param {string} s is the value to be checked if included
 */
const stringInArray = (arr, s) => {
  let found = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === s)
      found = true;
  }
  return found;
}

export { stringInArray }

/**
 * A very simple function to perform a basic
 * deep clone of an object.
 * @param {object} o is the object to perform the deep clone on
 */
const cloneDeep = (o) => {
  let ret = {};
  for (const p in o)
    ret[p] = o[p];
  return ret;
}

export { cloneDeep };

/**
 * A function to recursively merge to object, copying over all
 * properties of the old object missing from the target object.
 * In case a prop in is an object, the method is called recursively.
 * @param {object} target is the target object with the updates values.
 * @param {object} old is the old object from which the missing props are copied.
 */
const merge = (target, old) => {
  const oldKeys = Object.keys(old);
  // iterate over props of old
  for (let p in old) {
    if (!(p in target)) {
      //otherwise copy it over
      target[p] = old[p];
    }
    else {
      // in case the prop itself is an obj,
      // call method recursively,
      if (typeof target[p] === 'object' && typeof old[p] === 'object' && !Array.isArray(old[p])) {
        target[p] = merge((typeof target[p] === 'object' ? target[p] : {}), old[p]);
      }
    }
  }
  return target;
}

export { merge };

/**
 * A function get the intersection of two arrays. IE9+.
 * @param {array} arr1 is the first array of which to get the intersection
 * @param {array} arr2 is the second array of which to get the intersection
 */
const intersection = (arr1, arr2) => {
  return Array.prototype.filter.call(arr1, (n) => ~arr2.indexOf(n));
}

export { intersection };

/**
 * Debounce of Underscore.js
 */
const debounce = function (func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

export { debounce };

/**
 * Fisher-Yates shuffle ES6 non-mutating implementation.
 * @param {Array} array the array to shuffle
 * @return {Array} shuffled array without mutating the initial array.
 */
const shuffle = (array) => {
  // perform deep clone on array to mutate
  let cloned = array.slice(0);
  // array to return
  let randomizedArray = [];
  // perform shuffle
  while (cloned.length !== 0) {
    let rIndex = Math.floor(cloned.length * Math.random());
    randomizedArray.push(cloned[rIndex]);
    cloned.splice(rIndex, 1)
  }
  return randomizedArray;
};

export { shuffle };

/**
 * Simple method to check if two arrays of FilterItems
 * are sorted in the same manner or not.
 * @param {Array} arr1 the first array of FilterItems
 * @param {Array} arr2 the second array of FilterItems
 * @return {Boolean} equality
 */
const filterItemArraysHaveSameSorting = (a1, a2) => {
  // Exit case if arrays do not have equal length
  if (a1.length !== a2.length) return false;
  // Iterate over first array and compare indices with second
  for (let i = 0; i < a1.length; i++) {
    const index1 = a1[i].props.index;
    const index2 = a2[i].props.index;
    // Means arrays do not have identical sorting
    if (index1 !== index2) return false;
  }
  return true;
}

export { filterItemArraysHaveSameSorting };

/**
 * Simple non-mutating sorting function for arrays of objects by a property
 * @param {Array} array to sort
 * @param {Function} propFn fetches the property by which to sort
 * @return {Array} a new sorted array
 */
const sortBy = (array, propFn) => {
  let cloned = array.slice(0); // perform deep copy of array

  const comparator = (propFn) => {
    return (a, b) => {
      const propA = propFn(a);
      const propB = propFn(b);
      if (propA < propB) {
        return -1;
      } else if (propA > propB) {
        return 1;
      } else {
        return 0;
      }
    } 
  }

  return cloned.sort(comparator(propFn));
}

export { sortBy }
