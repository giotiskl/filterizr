/**
 * A function to check that all elements of an array are found within another array.
 * @param {Array} arr1 is the array of strings to be checked
 * @param {Array} arr2 is the array of strings to check against
 * @return {Boolean} whether all string of arr1 are contained in arr2
 */
const allStringsOfArray1InArray2 = (
  arr1: string[],
  arr2: string[]
): boolean => {
  for (let i = 0; i < arr1.length; i++) {
    let found = false;
    const string = arr1[i];
    for (let x = 0; x < arr2.length; x++) {
      if (string === arr2[x]) found = true;
    }
    if (!found) return false;
  }
  return true;
};

export { allStringsOfArray1InArray2 };

/**
 * Given a CSS prop it will normalize the syntax for JS
 * e.g. transform background-color to backgroundColor
 * @param {String} cssProp prop name
 * @return {String} normalized name
 */
const getNormalizedCssPropName = (cssProp: string): string => {
  if (!cssProp.includes('-')) {
    return cssProp;
  }

  const splitProp = cssProp.split('-');

  const first = splitProp[0];
  const rest = splitProp
    .slice(1, splitProp.length)
    .map((word: string) => word[0].toUpperCase() + word.slice(1, word.length))
    .join('');

  return `${first}${rest}`;
};

export { getNormalizedCssPropName };

/**
 * Set inline styles on an HTML node
 * @param {HTMLElement} node - HTML node
 * @param {Object} styles - object with styles
 * @returns {undefined}
 */
function setStylesOnHTMLNode(node: Element, styles: any) {
  Object.entries(styles).forEach(([key, value]) => {
    (<any>(<HTMLElement>node).style)[getNormalizedCssPropName(key)] = value;
  });
}

export { setStylesOnHTMLNode };

/**
 * Returns an object with value/key pairs of all data
 * attributes on an HTML element, disregarding the
 * two data attributes that are reserved for internal
 * usage by Filterizr
 * @param {Object} node - HTML node
 * @returns {Object} map of data attributes / values
 */
function getDataAttributesOfHTMLNode(node: Element) {
  const data: { [key: string]: any } = {
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

export { getDataAttributesOfHTMLNode };

/**
 * Check that a DOM element has a data-attribute present
 * @param {Object} node element
 * @param {String} dataAttributeName name of data attribute
 * @return {Boolean} data attribute exists
 */
function checkDataAttributeExists(
  node: Element,
  dataAttributeName: string
): boolean {
  const atts = Array.from(node.attributes);
  if (atts.length) {
    return (
      atts.filter(({ nodeName }) => nodeName === dataAttributeName).length > 0
    );
  }
  return false;
}

export { checkDataAttributeExists };

/**
 * A very simple function to perform a basic
 * deep clone of an object.
 * @param {Object} o is the object to perform the deep clone on
 * @return {Object} deep clone
 */
const makeShallowClone = (o: any) => {
  let ret: { [key: string]: any } = {};
  for (const p in o) {
    ret[p] = o[p];
  }
  return ret;
};

export { makeShallowClone };

/**
 * A function to recursively merge an object, copying over all
 * properties of the old object missing from the target object.
 * In case a prop in is an object, the method is called recursively.
 * This is a non-mutating method.
 * @param {Object} old is the old object from which the missing props are copied.
 * @param {Object} target is the target object with the updated values.
 */
const merge = (old: any, target: any) => {
  const ret = makeShallowClone(target);
  // Iterate over props of old
  for (let p in old) {
    if (!(p in ret)) {
      // Otherwise copy it over
      ret[p] = old[p];
    } else {
      // In case the prop itself is an obj, call method recursively.
      if (
        typeof ret[p] === 'object' &&
        typeof old[p] === 'object' &&
        !Array.isArray(old[p])
      ) {
        ret[p] = merge(typeof ret[p] === 'object' ? ret[p] : {}, old[p]);
      }
    }
  }
  return ret;
};

export { merge };

/**
 * A function get the intersection of two arrays. IE9+.
 * @param {Array} arr1 is the first array of which to get the intersection
 * @param {Array} arr2 is the second array of which to get the intersection
 */
const intersection = (arr1: any[], arr2: any[]) => {
  return Array.prototype.filter.call(arr1, (n: string) => arr2.includes(n));
};

export { intersection };

/**
 * Debounce of Underscore.js
 */
const debounce = function(
  func: Function,
  wait: number,
  immediate: boolean
): Function {
  let timeout: number;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
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
const shuffle = (array: any[]) => {
  // perform deep clone on array to mutate
  let cloned = array.slice(0);
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

export { shuffle };

/**
 * Simple method to check if two arrays of FilterItems
 * are sorted in the same manner or not.
 * @param {Array} arr1 the first array of FilterItems
 * @param {Array} arr2 the second array of FilterItems
 * @return {Boolean} equality
 */
const filterItemArraysHaveSameSorting = (a1: any[], a2: any[]): boolean => {
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
};

export { filterItemArraysHaveSameSorting };

/**
 * Simple non-mutating sorting function for arrays of objects by a property
 * @param {Array} array to sort
 * @param {Function} propFn fetches the property by which to sort
 * @return {Array} a new sorted array
 */
const sortBy = (array: any[], propFn: Function): any[] => {
  let cloned = array.slice(0); // perform deep copy of array

  const comparator = (propFn: Function) => {
    return (a: any, b: any) => {
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

export { sortBy };

/**
 * Error checking method to restrict a prop to some allowed values
 * @param {String} name of the option key in the options object
 * @param {String|Number|Object|Function|Array|Boolean} value of the option
 * @param {String} type of the property
 * @param {Array} allowed accepted values for option
 * @param {String} furtherHelpLink a link to docs for further help
 */
const checkOptionForErrors = (
  name: string,
  value: string | number | object | Function | any[] | boolean,
  type?: string,
  allowed?: any[] | RegExp,
  furtherHelpLink?: string
) => {
  if (typeof value === 'undefined') return; // exit case, missing from options

  // Define exception for type error
  const typeError = new Error(
    `Filterizr: expected type of option "${name}" to be "${type}", but its type is: "${typeof value}"`
  );
  let matchesOtherTypes = false;
  let isArray = false;
  const couldBeArray = type.includes('array');
  // Perform type checking
  if ((typeof value).match(type)) {
    matchesOtherTypes = true;
  } else if (!matchesOtherTypes && couldBeArray) {
    isArray = Array.isArray(value);
  }
  // Throw the errors for invalid types
  if (!matchesOtherTypes && !couldBeArray) {
    throw typeError;
  } else if (!matchesOtherTypes && couldBeArray && !isArray) {
    throw typeError;
  }

  // Make sure that the value of the option is within the accepted values
  const referTo = (link?: string) => {
    if (link) {
      return ` For further help read here: ${link}`;
    }
    return '';
  };

  if (Array.isArray(allowed)) {
    let validValue = false;
    allowed.forEach(el => {
      if (el === value) validValue = true;
    });
    if (!validValue) {
      throw new Error(
        `Filterizr: allowed values for option "${name}" are: ${allowed
          .map(el => `"${el}"`)
          .join(', ')}. Value received: "${value}".${referTo(furtherHelpLink)}`
      );
    }
  } else if (typeof value === 'string' && allowed instanceof RegExp) {
    const isValid = value.match(allowed);
    if (!isValid) {
      throw new Error(
        `Filterizr: invalid value "${value}" for option "${name}" received.${referTo(
          furtherHelpLink
        )}`
      );
    }
  }
};

export { checkOptionForErrors };

/**
 * A Regexp to validate potential values for the CSS easing property of transitions.
 */
const cssEasingValuesRegexp: RegExp = /(^linear$)|(^ease-in-out$)|(^ease-in$)|(^ease-out$)|(^ease$)|(^step-start$)|(^step-end$)|(^steps\(\d\s*,\s*(end|start)\))$|(^cubic-bezier\((\d*\.*\d+)\s*,\s*(\d*\.*\d+)\s*,\s*(\d*\.*\d+)\s*,\s*(\d*\.*\d+)\))$/;

export { cssEasingValuesRegexp };

/**
 * Possible animation states for Filterizr
 */
const FILTERIZR_STATE = {
  IDLE: 'IDLE',
  FILTERING: 'FILTERING',
  SORTING: 'SORTING',
  SHUFFLING: 'SHUFFLING',
};

export { FILTERIZR_STATE };
