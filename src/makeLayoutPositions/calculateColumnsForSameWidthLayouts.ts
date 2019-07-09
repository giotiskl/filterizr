export function calculateColumnsForSameWidthLayouts(
  gridWidth: number,
  itemWidth: number,
  gutterPixels: number
): number {
  return Math.floor(gridWidth / (itemWidth + gutterPixels));
}
