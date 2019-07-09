import { Position } from '../types/interfaces';
import FilterContainer from '../FilterContainer';

/**
 * Same height layout for items that have the same height, but can have varying width
 * @param filterContainer instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const { gutterPixels } = filterContainer.options.get();
  const filteredItems = filterItems.getFiltered(filterContainer.options.filter);

  const gridWidth = filterContainer.dimensions.width,
    itemHeight = filteredItems[0].dimensions.height;
  let row = 0,
    left = 0;

  // calculate array of positions
  const targetPositions = filteredItems.map(
    (filterItem): Position => {
      const { width } = filterItem.dimensions;
      // in case the item exceeds the grid then move to next row and reset left
      if (left + width > gridWidth) {
        row++;
        left = 0;
      }

      const targetPosition = {
        left,
        top: (itemHeight + gutterPixels) * row,
      };

      left += width + filterContainer.options.get().gutterPixels;

      return targetPosition;
    }
  );

  // update the height of the FilterContainer
  filterContainer.setHeight(
    (row + 1) * (filteredItems[0].dimensions.height + gutterPixels) +
      gutterPixels
  );
  // return the array of new positions
  return targetPositions;
};
