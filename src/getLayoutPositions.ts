import Filterizr from './Filterizr';
import getHorizontalLayoutPositions from './layouts/getHorizontalLayoutPositions';
import getVerticalLayoutPositions from './layouts/getVerticalLayoutPositions';
import getSameHeightLayoutPositions from './layouts/getSameHeightLayoutPositions';
import getSameWidthLayoutPositions from './layouts/getSameWidthLayoutPositions';
import getSameSizeLayoutPosition from './layouts/getSameSizeLayoutPosition';
import getPackedLayoutPositions from './layouts/getPackedLayoutPositions';

/**
 * Calculates and returns an array of objects representing
 * the next positions the FilterItems are supposed to assume.
 * @param {String} layout - name of helper method to be used
 * @param {Object} Filterizr - instance
 * @return {Object} layout to be used by Filterizr
 */
const getLayoutPositions = (layout: string, Filterizr: Filterizr) => {
  switch (layout) {
    case 'horizontal':
      return getHorizontalLayoutPositions(Filterizr);
    case 'vertical':
      return getVerticalLayoutPositions(Filterizr);
    case 'sameHeight':
      return getSameHeightLayoutPositions(Filterizr);
    case 'sameWidth':
      return getSameWidthLayoutPositions(Filterizr);
    case 'packed':
      return getPackedLayoutPositions(Filterizr);
    case 'sameSize':
    default:
      return getSameSizeLayoutPosition(Filterizr);
  }
};

export default getLayoutPositions;
