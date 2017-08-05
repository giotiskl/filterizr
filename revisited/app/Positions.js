import { map } from 'lodash';

/**
 * Calculates and returns an array of objects representing
 * the next positions the FilterItems are supposed to assume.
 * @param {object} container is the FilterContainer
 */
const Positions = (Layout, Filterizr) => {
  switch(Layout) {
    case 'sameSize':
      // extract FilterContainer and FilterItems
      // from the Filterizr instance
      const {
        FilterContainer,
        FilterItems
      } = Filterizr.props;
      console.log(Filterizr.props)
      // calculate number of columns and rows the grid should have
      let cols = FilterContainer.calcColumns(Layout);
      let row = 0;
      // calculate array of positions
      const targetPositions = map(FilterItems, (FilterItem, index) => {
        // update current row
        if (index % cols === 0 && index >= cols)
          row++;
        // determine pos in grid
        const spot = index - (cols * row);
        // return object with new position in array
        return {
          left: spot * FilterItem.props.w,
          top: row * FilterItem.props.h,
        }
      });
      // update the height of the FilterContainer
      // before returning from the method
      FilterContainer.updateHeight((row+1) * FilterItems[0].props.h);
      // return the array of new positions
      return targetPositions;
  }
}

export default Positions;
