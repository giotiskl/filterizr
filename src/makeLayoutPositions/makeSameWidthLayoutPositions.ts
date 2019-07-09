import { Position } from '../types/interfaces';
import FilterItem from '../FilterItem';
import FilterContainer from '../FilterContainer';
import { calculateColumnsForSameWidthLayouts } from './calculateColumnsForSameWidthLayouts';

/**
 * Helper method used to calculate what the top
 * of the current item in the iteration should be.
 * @param filteredItems collection
 * @param cols of grid
 * @param index of current item in filteredItems collection
 */
const calcItemTop = (
  filteredItems: FilterItem[],
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
    itemTop += filteredItems[index].dimensions.height + gutterPixels;
    index -= cols;
  }
  return itemTop;
};

/**
 * Same width layout for items that have the same width, but can have varying height
 * @param filterContainer instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const { gutterPixels } = filterContainer.options.get();
  const filteredItems = filterItems.getFiltered(filterContainer.options.filter);

  // Calculate number of columns and rows the grid should have
  let cols = calculateColumnsForSameWidthLayouts(
    filterContainer.dimensions.width,
    filterItems.getItem(0).dimensions.width,
    gutterPixels
  );
  let row = 0;
  let columnHeights = Array.apply(null, Array(cols)).map(
    Number.prototype.valueOf,
    0
  );

  // Calculate array of positions
  const targetPositions = filteredItems.map(
    (filterItem, index): Position => {
      // Update height of tallest item in row if needed
      const { width, height } = filterItem.dimensions;

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
        top: calcItemTop(filteredItems, cols, index, gutterPixels),
      };
    }
  );

  // Update the height of the FilterContainer
  // before returning from the method
  filterContainer.setHeight(Math.max(...columnHeights) + gutterPixels);

  // Return the array of new positions
  return targetPositions;
};
