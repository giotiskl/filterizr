import { ContainerLayout, Dimensions, Position } from '../types/interfaces';

function calculateWidthSumWithGutters(
  itemsDimensions: Dimensions[],
  gutterPixels: number
): number {
  return (
    itemsDimensions.reduce((acc, { width }): number => acc + width, 0) +
    gutterPixels
  );
}

/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 */
export default (
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => ({
  containerHeight: Math.max.apply(
    Math,
    itemsDimensions.map(({ height }): number => height)
  ),
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
