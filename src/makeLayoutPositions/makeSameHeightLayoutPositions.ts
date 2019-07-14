import { ContainerLayout, Position, Dimensions } from '../types/interfaces';

/**
 * Same height layout for items that have the same height, but can have varying width
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  const endWidths = itemsDimensions.map(({ width }, index): number => {
    const previousItemsWidthSum = itemsDimensions
      .slice(0, index)
      .reduce((sum, { width }): number => sum + width + gutterPixels, 0);
    return width + previousItemsWidthSum + gutterPixels;
  });

  const itemsPositions = itemsDimensions.map(
    ({ height }, index): Position => {
      const row = Math.floor(endWidths[index] / containerWidth);
      const sameRowPreviousItemsWidthSum = itemsDimensions
        .slice(0, index)
        .filter((_, previousItemIndex): boolean => {
          const previousItemRow = Math.floor(
            endWidths[previousItemIndex] / containerWidth
          );
          return previousItemRow === row;
        })
        .reduce((sum, { width }): number => sum + width + gutterPixels, 0);

      return {
        left: sameRowPreviousItemsWidthSum,
        top: (height + gutterPixels) * row,
      };
    }
  );

  const lastEndWidth = endWidths[endWidths.length - 1];
  const totalRows = Math.floor(lastEndWidth / containerWidth) + 1;
  const itemHeight = itemsDimensions[0].height + gutterPixels;
  const containerHeight = totalRows * itemHeight + gutterPixels;

  return {
    containerHeight,
    itemsPositions,
  };
};
