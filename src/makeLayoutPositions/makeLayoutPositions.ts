import { ContainerLayout, Dimensions, Options } from '../types/interfaces';
import memoize from 'fast-memoize';
import makeHorizontalLayoutPositions from './makeHorizontalLayoutPositions';
import makeVerticalLayoutPositions from './makeVerticalLayoutPositions';
import makeSameHeightLayoutPositions from './makeSameHeightLayoutPositions';
import makeSameWidthLayoutPositions from './makeSameWidthLayoutPositions';
import makeSameSizeLayoutPosition from './makeSameSizeLayoutPosition';
import makePackedLayoutPositions from './makePackedLayoutPositions';

/**
 * Creates the specifications of the dimensions of the
 * container and items for the next render of Filterizr.
 */
export default memoize(
  (
    containerWidth: number,
    itemsDimensions: Dimensions[],
    { gutterPixels, layout }: Options
  ): ContainerLayout => {
    if (!itemsDimensions.length) {
      return {
        containerHeight: 0,
        itemsPositions: [],
      };
    }

    switch (layout) {
      case 'horizontal':
        return makeHorizontalLayoutPositions(itemsDimensions, gutterPixels);
      case 'vertical':
        return makeVerticalLayoutPositions(itemsDimensions, gutterPixels);
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
  }
);
