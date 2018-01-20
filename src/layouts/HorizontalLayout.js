/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 * @param {object} Filterizr instance.
 */
const HorizontalLayout = (Filterizr) => {
  const {
    FilterContainer,
    FilterItems
  } = Filterizr.props;
  let left = 0, 
    containerHeight = 0; // target height of FilterContainer

  const targetPositions = FilterItems.map((FilterItem) => {
    const pos = {
      left: left,
      top: 0,
    };

    // update left for next item
    left += FilterItem.props.w;
    // check if target height of FilterContainer should be increased
    if (FilterItem.props.h > containerHeight)
      containerHeight = FilterItem.props.h;

    return pos;
  });

  // update the height of the FilterContainer
  FilterContainer.updateHeight(containerHeight);

  return targetPositions;
};

export default HorizontalLayout;
