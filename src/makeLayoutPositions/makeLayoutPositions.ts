import { LAYOUT } from './../config';
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
      case LAYOUT.HORIZONTAL:
        return makeHorizontalLayoutPositions(itemsDimensions, gutterPixels);
      case LAYOUT.VERTICAL:
        return makeVerticalLayoutPositions(itemsDimensions, gutterPixels);
      case LAYOUT.SAME_HEIGHT:
        return makeSameHeightLayoutPositions(
          containerWidth,
          itemsDimensions,
          gutterPixels
        );
      case LAYOUT.SAME_WIDTH:
        return makeSameWidthLayoutPositions(
          containerWidth,
          itemsDimensions,
          gutterPixels
        );
      case LAYOUT.PACKED:
        return makePackedLayoutPositions(
          containerWidth,
          itemsDimensions,
          gutterPixels
        );
      case LAYOUT.SAME_SIZE:
      default:
        return makeSameSizeLayoutPosition(
          containerWidth,
          itemsDimensions,
          gutterPixels
        );
    }
  }
);
