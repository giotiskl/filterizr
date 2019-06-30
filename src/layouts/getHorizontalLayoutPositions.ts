import Filterizr from '../Filterizr';

/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 * @param {Object} Filterizr instance.
 * @return {Object[]} positions for the items to assume.
 */
const getHorizontalLayoutPositions = (filterizr: Filterizr) => {
  const { filterContainer } = filterizr.props;
  const filteredItems = filterizr.props.filterItems.getFiltered(
    filterizr.options.get().filter.get()
  );

  let left: number = 0,
    containerHeight: number = 0;

  const targetPositions = filteredItems.map(filterItem => {
    const { w, h } = filterItem.props;
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
  filterContainer.updateHeight(containerHeight);

  return targetPositions;
};

export default getHorizontalLayoutPositions;
