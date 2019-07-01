import { Position } from './FilterItem';
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
 * @param {Object} filterizr - instance
 * @return {Object} layout to be used by Filterizr
 */
const getLayoutPositions = (
  layout: string,
  filterizr: Filterizr
): Position[] => {
  switch (layout) {
    case 'horizontal':
      return getHorizontalLayoutPositions(filterizr);
    case 'vertical':
      return getVerticalLayoutPositions(filterizr);
    case 'sameHeight':
      return getSameHeightLayoutPositions(filterizr);
    case 'sameWidth':
      return getSameWidthLayoutPositions(filterizr);
    case 'packed':
      return getPackedLayoutPositions(filterizr);
    case 'sameSize':
    default:
      return getSameSizeLayoutPosition(filterizr);
  }
};

export default getLayoutPositions;
