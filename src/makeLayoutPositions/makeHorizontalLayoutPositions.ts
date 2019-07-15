import { ContainerLayout, Dimensions, Position } from '../types/interfaces';

function calculateWidthSumWithGutters(
  itemsDimensions: Dimensions[],
  gutterPixels: number
): number {
  return itemsDimensions.reduce(
    (acc, { width }): number => acc + width + gutterPixels,
    0
  );
}

/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 */
export default (
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => ({
  containerHeight:
    Math.max(...itemsDimensions.map(({ height }): number => height)) +
    gutterPixels * 2,
  itemsPositions: itemsDimensions.map(
    ({}, index: number): Position => ({
      left: calculateWidthSumWithGutters(
        itemsDimensions.slice(0, index),
        gutterPixels
      ),
      top: 0,
    })
  ),
});
