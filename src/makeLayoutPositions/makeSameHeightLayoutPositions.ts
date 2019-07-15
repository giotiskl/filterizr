import {
  ContainerLayout,
  Position,
  Dimensions,
  Dictionary,
} from '../types/interfaces';

/**
 * Same height layout for items that have the same height, but can have varying width
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  const endWidths = itemsDimensions.map(({ width }, index): number => {
    const prevWidth = itemsDimensions
      .slice(0, index)
      .reduce((acc, { width }): number => acc + width + gutterPixels * 2, 0);
    return prevWidth + width + gutterPixels;
  });

  const rowStartIndexes: Dictionary = endWidths.reduce(
    (acc: Dictionary, width, index): object => {
      const accLength = Object.keys(acc).length;
      const rowMustBreak = width > containerWidth * accLength;
      return {
        ...acc,
        ...(rowMustBreak && { [accLength]: index }),
      };
    },
    { 0: 0 }
  );

  const itemsPositions = itemsDimensions.map(
    ({ height }, index): Position => {
      const row = Math.floor(endWidths[index] / containerWidth);
      return {
        left: itemsDimensions
          .slice(rowStartIndexes[row], index)
          .reduce((acc, { width }): number => acc + width + gutterPixels, 0),
        top: (height + gutterPixels) * row,
      };
    }
  );

  const totalRows = Object.keys(rowStartIndexes).length;
  const totalItemHeight = itemsDimensions[0].height + gutterPixels;
  const containerHeight = totalRows * totalItemHeight + gutterPixels;

  return {
    containerHeight,
    itemsPositions,
  };
};
