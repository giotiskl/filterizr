import { ContainerLayout, Dimensions, Options } from '../types/interfaces';
import makeHorizontalLayoutPositions from './makeHorizontalLayoutPositions';
import makeVerticalLayoutPositions from './makeVerticalLayoutPositions';
import makeSameHeightLayoutPositions from './makeSameHeightLayoutPositions';
import makeSameWidthLayoutPositions from './makeSameWidthLayoutPositions';
import makeSameSizeLayoutPosition from './makeSameSizeLayoutPosition';
import makePackedLayoutPositions from './makePackedLayoutPositions';

/**
 * Calculates and returns an array of objects representing
 * the next positions the FilterItems are supposed to assume.
 * @param layout name of helper method to be used
 * @param filterizr instance
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  { gutterPixels, layout }: Options
): ContainerLayout => {
  switch (layout) {
    case 'horizontal':
      return makeHorizontalLayoutPositions(
        containerWidth,
        itemsDimensions,
        gutterPixels
      );
    case 'vertical':
      return makeVerticalLayoutPositions(
        containerWidth,
        itemsDimensions,
        gutterPixels
      );
    case 'sameHeight':
      return makeSameHeightLayoutPositions(
        containerWidth,
        itemsDimensions,
        gutterPixels
      );
    case 'sameWidth':
      return makeSameWidthLayoutPositions(
        containerWidth,
        itemsDimensions,
        gutterPixels
      );
    case 'packed':
      return makePackedLayoutPositions(
        containerWidth,
        itemsDimensions,
        gutterPixels
      );
    case 'sameSize':
    default:
      return makeSameSizeLayoutPosition(
        containerWidth,
        itemsDimensions,
        gutterPixels
      );
  }
};
