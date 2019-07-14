import { ContainerLayout, Position, Dimensions } from '../types/interfaces';

/**
 * Same height layout for items that have the same height, but can have varying width
 * @param filterContainer instance.
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  let row = 0,
    left = 0;

  // calculate array of positions
  const itemsPositions = itemsDimensions.map(
    ({ width, height }): Position => {
      // in case the item exceeds the grid then move to next row and reset left
      if (left + width > containerWidth) {
        row++;
        left = 0;
      }

      const targetPosition = {
        left,
        top: (height + gutterPixels) * row,
      };

      left += width + gutterPixels;

      return targetPosition;
    }
  );

  return {
    containerHeight:
      (row + 1) * (itemsDimensions[0].height + gutterPixels) + gutterPixels,
    itemsPositions,
  };
};
