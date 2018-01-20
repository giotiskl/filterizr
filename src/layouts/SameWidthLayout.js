/**
 * Same width layout for items that have the same width, but can have varying height
 * @param {object} Filterizr instance.
 */
const SameWidthLayout = (Filterizr) => {
  const {
    FilterContainer,
    FilterItems
  } = Filterizr.props;
  // calculate number of columns and rows the grid should have
  let cols = FilterContainer.calcColumns(),
    row  = 0,
    heightOfTallestInRow = 0,
    containerHeight = 0;

  // calculate array of positions
  const targetPositions = FilterItems.map((FilterItem, index) => {
    // update height of tallest item in row if needed
    const h = FilterItem.props.h;
    if (h > heightOfTallestInRow)
      heightOfTallestInRow = h;

    // update current row, increment container 
    // height and  reset height of tallest in row
    if (index % cols === 0 && index >= cols) {
      row++;
      containerHeight += heightOfTallestInRow;
      heightOfTallestInRow = 0;
    }
    // determine pos in grid
    const spot = index - (cols * row);
    // return object with new position in array
    return {
      left: spot * FilterItem.props.w,
      top:  calcItemTop(FilterItems, cols, index),
    };
  });
  // increment the container height by the final
  // value of the height of the tallest item in row
  containerHeight += heightOfTallestInRow;
  // update the height of the FilterContainer
  // before returning from the method
  FilterContainer.updateHeight(containerHeight);
  // return the array of new positions
  return targetPositions;
};

/**
 * Helper method used to calculate what the top
 * of the current item in the iteration should be.
 * @param {array} FilterItems collection
 * @param {integer} cols of grid
 * @param {integer} index of current item in FilterItems collection
 */
const calcItemTop = (FilterItems, cols, index) => {
  let itemTop = 0;
  // means we're still iterating over 
  // the first row, top should be 0
  if (index < cols - 1)
    return 0;
  // decrease index by cols to access the item
  // located right above
  index -= cols;
  // if we're over the first row loop until
  // we calculate the height of all items above
  while (index >= 0) {
    itemTop += FilterItems[index].props.h;
    index   -= cols;
  }
  return itemTop;
};

export default SameWidthLayout;
