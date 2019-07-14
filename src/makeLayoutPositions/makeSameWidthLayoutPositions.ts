import { ContainerLayout, Dimensions, Position } from '../types/interfaces';

/**
 * Same width layout for items that have the same width and varying height
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  const columns = Math.floor(
    containerWidth / (itemsDimensions[0].width + gutterPixels)
  );

  const itemsPositions = itemsDimensions.map(
    ({ width }, index): Position => {
      const row = Math.floor(index / columns);
      const col = index - columns * row;
      return {
        left: col * (width + gutterPixels),
        // The top position of every item for this layout
        // is the sum of the items positioned above it
        top: itemsDimensions
          .slice(0, index)
          .filter((_, subIndex): boolean => (index - subIndex) % columns === 0)
          .reduce((sum, { height }): number => sum + height + gutterPixels, 0),
      };
    }
  );

  // The height of the container for this layout is
  // going to be the same as that of the longest column.
  const columnsHeights = itemsDimensions.reduce(
    (acc, { height }, index): number[] => {
      const row = Math.floor(index / columns);
      const col = index - columns * row;
      acc[col] += height + gutterPixels;
      return acc;
    },
    Array.apply(null, Array(columns)).map(Number.prototype.valueOf, 0)
  );

  return {
    containerHeight: Math.max(...columnsHeights) + gutterPixels,
    itemsPositions,
  };
};
