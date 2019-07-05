import { Position } from '../FilterItem';
import FilterContainer from '../FilterContainer';

/**
 * Same height layout for items that have the same height, but can have varying width
 * @param filterContainer instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const filteredItems = filterItems.getFiltered(
    filterContainer.options.get().filter.get()
  );

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
        left: left,
        top: itemHeight * row,
      };

      left += width;

      return targetPosition;
    }
  );

  // update the height of the FilterContainer
  filterContainer.updateHeight((row + 1) * filteredItems[0].dimensions.height);
  // return the array of new positions
  return targetPositions;
};
