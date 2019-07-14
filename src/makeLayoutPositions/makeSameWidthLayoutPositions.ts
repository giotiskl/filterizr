import { ContainerLayout, Dimensions, Position } from '../types/interfaces';
import { calculateColumnsForSameWidthLayouts } from './calculateColumnsForSameWidthLayouts';

/**
 * Helper method used to calculate what the top
 * of the current item in the iteration should be.
 */
const calcItemTop = (
  itemsDimensions: Dimensions[],
  cols: number,
  index: number,
  gutterPixels: number
): number => {
  // Prevent infinite loop on window resize when container is not visible
  if (cols <= 0) return 0;

  let itemTop = 0;
  // Means we're still iterating over the first row, top should be 0
  if (index < cols - 1) return 0;
  // Decrease index by cols to access the item located right above
  index -= cols;
  // If we're over the first row loop until we calculate the height of all items above
  while (index >= 0) {
    itemTop += itemsDimensions[index].height + gutterPixels;
    index -= cols;
  }
  return itemTop;
};

/**
 * Same width layout for items that have the same width, but can have varying height
 * @param filterContainer instance.
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  // Calculate number of columns and rows the grid should have
  let cols = calculateColumnsForSameWidthLayouts(
    containerWidth,
    itemsDimensions[0].width,
    gutterPixels
  );
  let row = 0;
  let columnHeights = Array.apply(null, Array(cols)).map(
    Number.prototype.valueOf,
    0
  );

  // Calculate array of positions
  const itemsPositions = itemsDimensions.map(
    ({ width, height }, index): Position => {
      // Update current row, increment container
      // height and  reset height of tallest in row
      if (index % cols === 0 && index >= cols) row++;

      // Determine pos in grid
      const spot = index - cols * row;

      // Update height of column
      columnHeights[spot] += height + gutterPixels;

      // Return object with new position in array
      return {
        left: spot * (width + gutterPixels),
        top: calcItemTop(itemsDimensions, cols, index, gutterPixels),
      };
    }
  );

  return {
    containerHeight: Math.max(...columnHeights) + gutterPixels,
    itemsPositions,
  };
};
