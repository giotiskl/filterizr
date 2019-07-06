import { Position } from '../types/interfaces';
import FilterContainer from '../FilterContainer';

/**
 * Same size layout for items that have the same width/height
 * @param filterContainer instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const { gutterPixels } = filterContainer.options.get();
  const filteredItems = filterItems.getFiltered(filterContainer.options.filter);
  // calculate number of columns and rows the grid should have
  let cols = filterContainer.calculateColumns();
  let row = 0;
  // calculate array of positions
  const targetPositions = filteredItems.map(
    ({ dimensions: { width, height } }, index): Position => {
      // update current row
      if (index % cols === 0 && index >= cols) row++;
      // determine pos in grid
      const spot = index - cols * row;
      // return object with new position in array
      return {
        left: spot * (width + gutterPixels),
        top: row * (height + gutterPixels),
      };
    }
  );

  const rows = row + 1;

  // Update the height of the FilterContainer
  // before returning from the method
  const firstItemHeight =
    (filteredItems[0] && filteredItems[0].dimensions.height) || 0;
  filterContainer.updateHeight(
    rows * (firstItemHeight + gutterPixels) - gutterPixels
  );

  // Return the array of new positions
  return targetPositions;
};
