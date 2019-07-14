import { ContainerLayout, Dimensions, Position } from '../types/interfaces';

function calculateHeightSumWithGutters(
  itemsDimensions: Dimensions[],
  gutterPixels: number
): number {
  return (
    itemsDimensions.reduce((acc, { height }): number => acc + height, 0) +
    gutterPixels
  );
}

/**
 * Vertical layout algorithm that arranges all FilterItems in one column. Their height may vary.
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => ({
  containerHeight: calculateHeightSumWithGutters(itemsDimensions, gutterPixels),
  itemsPositions: itemsDimensions.map(
    ({}, index): Position => ({
      left: 0,
      top: calculateHeightSumWithGutters(
        itemsDimensions.slice(0, index),
        gutterPixels
      ),
    })
  ),
});
