/**
 * Same width layout for items that have the same width, but can have varying height
 * @param {object} Filterizr instance.
 */
const SameWidthLayout = (Filterizr) => {
  const {
    FilterContainer,
    FilteredItems,
  } = Filterizr.props;

  // Calculate number of columns and rows the grid should have
  let cols = FilterContainer.calcColumns(),
    row = 0,
    columnHeights = Array.apply(null, Array(cols)).map(Number.prototype.valueOf, 0);

  // Calculate array of positions
  const targetPositions = FilteredItems.map((FilterItem, index) => {
    // Update height of tallest item in row if needed
    const { w, h } = FilterItem.props;

    // Update current row, increment container 
    // height and  reset height of tallest in row
    if (index % cols === 0 && index >= cols) row++;

    // Determine pos in grid
    const spot = index - (cols * row);

    // Update height of column
    columnHeights[spot] += h;

    // Return object with new position in array
    return {
      left: spot * w,
      top: calcItemTop(FilteredItems, cols, index),
    };
  });

  // Update the height of the FilterContainer
  // before returning from the method
  FilterContainer.updateHeight(Math.max(...columnHeights));

  // Return the array of new positions
  return targetPositions;
};

/**
 * Helper method used to calculate what the top
 * of the current item in the iteration should be.
 * @param {array} FilteredItems collection
 * @param {integer} cols of grid
 * @param {integer} index of current item in FilteredItems collection
 */
const calcItemTop = (FilteredItems, cols, index) => {
  // Prevent infinite loop on window resize when container is not visible
  if (cols <= 0) return 0;

  let itemTop = 0;
  // Means we're still iterating over the first row, top should be 0
  if (index < cols - 1) return 0;
  // Decrease index by cols to access the item located right above
  index -= cols;
  // If we're over the first row loop until we calculate the height of all items above
  while (index >= 0) {
    itemTop += FilteredItems[index].props.h;
    index -= cols;
  }
  return itemTop;
};

export default SameWidthLayout;
