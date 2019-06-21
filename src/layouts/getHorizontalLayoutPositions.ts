import Filterizr from '../Filterizr';

/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 * @param {Object} Filterizr instance.
 * @return {Object[]} positions for the items to assume.
 */
const getHorizontalLayoutPositions = (Filterizr: Filterizr) => {
  const { FilterContainer, FilteredItems } = Filterizr.props;

  let left: number = 0,
    containerHeight: number = 0;

  const targetPositions = FilteredItems.map(FilterItem => {
    const { w, h } = FilterItem.props;
    const pos = {
      left: left,
      top: 0,
    };

    // update left for next item
    left += w;
    // check if target height of FilterContainer should be increased
    if (h > containerHeight) containerHeight = h;

    return pos;
  });

  // update the height of the FilterContainer
  FilterContainer.updateHeight(containerHeight);

  return targetPositions;
};

export default getHorizontalLayoutPositions;