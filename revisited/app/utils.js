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
