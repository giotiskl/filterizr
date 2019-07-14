import { ContainerLayout, Position, Dimensions } from '../types/interfaces';
import { calculateColumnsForSameWidthLayouts } from './calculateColumnsForSameWidthLayouts';

/**
 * Same size layout for items that have the same width/height
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  let cols = calculateColumnsForSameWidthLayouts(
    containerWidth,
    itemsDimensions[0].width,
    gutterPixels
  );
  let row = 0;

  const itemsPositions = itemsDimensions.map(
    ({ width, height }, index): Position => {
      // update current row
      if (index % cols === 0 && index >= cols) row++;
      // determine pos in grid
      const spot = index - cols * row;
      // return object with new position in array
      return {
        left: spot * (width + gutterPixels),
        top: row * (height + gutterPixels),
      };
    }
  );

  // These help calculate the final container height
  const totalRows = row + 1;
  const firstItemHeight = (itemsDimensions[0].height || 0) + gutterPixels;
  const containerHeight = totalRows * firstItemHeight + gutterPixels;

  return {
    containerHeight,
    itemsPositions,
  };
};
