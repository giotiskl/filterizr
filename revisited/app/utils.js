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
