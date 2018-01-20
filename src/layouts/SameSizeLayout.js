/**
 * Same size layout for items that have the same width/height
 * @param {object} Filterizr instance.
 */
const SameSizeLayout = (Filterizr) => {
  const {
    FilterContainer,
    FilterItems
  } = Filterizr.props;
  // calculate number of columns and rows the grid should have
  let cols = FilterContainer.calcColumns();
  let row = 0;
  // calculate array of positions
  const targetPositions = FilterItems.map((FilterItem, index) => {
    // update current row
    if (index % cols === 0 && index >= cols)
      row++;
    // determine pos in grid
    const spot = index - (cols * row);
    // return object with new position in array
    return {
      left: spot * FilterItem.props.w,
      top: row * FilterItem.props.h,
    };
  });
  // update the height of the FilterContainer
  // before returning from the method
  FilterContainer.updateHeight((row+1) * FilterItems[0].props.h);
  // return the array of new positions
  return targetPositions;
};

export default SameSizeLayout;
