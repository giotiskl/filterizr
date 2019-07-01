import { Position } from '../FilterItem';
import FilterContainer from '../FilterContainer';

/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 * @param filterContainer instance.
 */
const getHorizontalLayoutPositions = (
  filterContainer: FilterContainer
): Position[] => {
  const { filterItems } = filterContainer.props;
  const filteredItems = filterItems.getFiltered(
    filterContainer.options.get().filter.get()
  );

  let left = 0,
    containerHeight = 0;

  const targetPositions = filteredItems.map(
    (filterItem): Position => {
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
    }
  );

  // update the height of the FilterContainer
  filterContainer.updateHeight(containerHeight);

  return targetPositions;
};

export default getHorizontalLayoutPositions;
