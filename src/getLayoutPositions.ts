import { Position } from './FilterItem';
import getHorizontalLayoutPositions from './layouts/getHorizontalLayoutPositions';
import getVerticalLayoutPositions from './layouts/getVerticalLayoutPositions';
import getSameHeightLayoutPositions from './layouts/getSameHeightLayoutPositions';
import getSameWidthLayoutPositions from './layouts/getSameWidthLayoutPositions';
import getSameSizeLayoutPosition from './layouts/getSameSizeLayoutPosition';
import getPackedLayoutPositions from './layouts/getPackedLayoutPositions';
import FilterContainer from './FilterContainer';

/**
 * Calculates and returns an array of objects representing
 * the next positions the FilterItems are supposed to assume.
 * @param layout name of helper method to be used
 * @param filterizr instance
 */
const getLayoutPositions = (
  layout: string,
  filterContainer: FilterContainer
): Position[] => {
  switch (layout) {
    case 'horizontal':
      return getHorizontalLayoutPositions(filterContainer);
    case 'vertical':
      return getVerticalLayoutPositions(filterContainer);
    case 'sameHeight':
      return getSameHeightLayoutPositions(filterContainer);
    case 'sameWidth':
      return getSameWidthLayoutPositions(filterContainer);
    case 'packed':
      return getPackedLayoutPositions(filterContainer);
    case 'sameSize':
    default:
      return getSameSizeLayoutPosition(filterContainer);
  }
};

export default getLayoutPositions;
