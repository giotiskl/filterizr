import { Position } from '../FilterItem';
import Filterizr from '../Filterizr';

/**
 * Same size layout for items that have the same width/height
 * @param {object} Filterizr instance.
 */
const getSameSizeLayoutPosition = (filterizr: Filterizr): Position[] => {
  const { filterContainer } = filterizr.props;
  const {
    props: { filterItems },
  } = filterContainer;
  const filteredItems = filterItems.getFiltered(
    filterizr.options.get().filter.get()
  );
  // calculate number of columns and rows the grid should have
  let cols = filterContainer.calculateColumns();
  let row = 0;
  // calculate array of positions
  const targetPositions = filteredItems.map(
    ({ props: { w, h } }, index): Position => {
      // update current row
      if (index % cols === 0 && index >= cols) row++;
      // determine pos in grid
      const spot = index - cols * row;
      // return object with new position in array
      return {
        left: spot * w,
        top: row * h,
      };
    }
  );

  // Update the height of the FilterContainer
  // before returning from the method
  const firstItemHeight = (filteredItems[0] && filteredItems[0].props.h) || 0;
  filterContainer.updateHeight((row + 1) * firstItemHeight);

  // Return the array of new positions
  return targetPositions;
};

export default getSameSizeLayoutPosition;
