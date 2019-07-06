import { Position } from '../types/interfaces';
import makeHorizontalLayoutPositions from './makeHorizontalLayoutPositions';
import makeVerticalLayoutPositions from './makeVerticalLayoutPositions';
import makeSameHeightLayoutPositions from './makeSameHeightLayoutPositions';
import makeSameWidthLayoutPositions from './makeSameWidthLayoutPositions';
import makeSameSizeLayoutPosition from './makeSameSizeLayoutPosition';
import makePackedLayoutPositions from './makePackedLayoutPositions';
import FilterContainer from '../FilterContainer';

/**
 * Calculates and returns an array of objects representing
 * the next positions the FilterItems are supposed to assume.
 * @param layout name of helper method to be used
 * @param filterizr instance
 */
export default (
  layout: string,
  filterContainer: FilterContainer
): Position[] => {
  switch (layout) {
    case 'horizontal':
      return makeHorizontalLayoutPositions(filterContainer);
    case 'vertical':
      return makeVerticalLayoutPositions(filterContainer);
    case 'sameHeight':
      return makeSameHeightLayoutPositions(filterContainer);
    case 'sameWidth':
      return makeSameWidthLayoutPositions(filterContainer);
    case 'packed':
      return makePackedLayoutPositions(filterContainer);
    case 'sameSize':
    default:
      return makeSameSizeLayoutPosition(filterContainer);
  }
};
