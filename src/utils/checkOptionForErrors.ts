/**
 * Error checking method to restrict a prop to some allowed values
 * @param {String} name of the option key in the options object
 * @param {String|Number|Object|Function|Array|Boolean} value of the option
 * @param {String} type of the property
 * @param {Array} allowed accepted values for option
 * @param {String} furtherHelpLink a link to docs for further help
 */
export const checkOptionForErrors = (
  name: string,
  value: string | number | object | Function | any[] | boolean,
  type?: string,
  allowed?: any[] | RegExp,
  furtherHelpLink?: string
): void => {
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
  const referTo = (link?: string): string => {
    if (link) {
      return ` For further help read here: ${link}`;
    }
    return '';
  };

  if (Array.isArray(allowed)) {
    let validValue = false;
    allowed.forEach((el): void => {
      if (el === value) validValue = true;
    });
    if (!validValue) {
      throw new Error(
        `Filterizr: allowed values for option "${name}" are: ${allowed
          .map((el): string => `"${el}"`)
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
