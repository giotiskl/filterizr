import { ContainerLayout, Dimensions, Position } from '../types/interfaces';

function calculateHeightSumWithGutters(
  itemsDimensions: Dimensions[],
  gutterPixels: number
): number {
  if (!itemsDimensions.length) {
    return 0;
  }

  return itemsDimensions.reduce(
    (acc, { height }): number => acc + height + gutterPixels,
    0
  );
}

/**
 * Vertical layout algorithm that arranges all FilterItems in one column. Their height may vary.
 */
export default (
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => ({
  containerHeight:
    calculateHeightSumWithGutters(itemsDimensions, gutterPixels) + gutterPixels,
  itemsPositions: itemsDimensions.map(
    (_, index): Position => ({
      left: 0,
      top: calculateHeightSumWithGutters(
        itemsDimensions.slice(0, index),
        gutterPixels
      ),
    })
  ),
});
