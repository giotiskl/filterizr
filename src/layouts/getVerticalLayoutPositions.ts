import { Position } from '../FilterItem';
import FilterContainer from '../FilterContainer';

/**
 * Vertical layout algorithm that arranges all FilterItems in one column. Their height may vary.
 * @param filterizr instance.
 */
const getVerticalLayoutPositions = (
  filterContainer: FilterContainer
): Position[] => {
  const { filterItems } = filterContainer;
  const filteredItems = filterItems.getFiltered(
    filterContainer.options.get().filter.get()
  );

  // In this layout top in the end will also
  // be the total height of the FilterContainer
  let top = 0;

  const targetPositions = filteredItems.map(
    (filterItem): Position => {
      const { height } = filterItem.dimensions;
      const pos = {
        left: 0,
        top: top,
      };

      top += height;

      return pos;
    }
  );

  // Update the height of the FilterContainer
  filterContainer.updateHeight(top);

  return targetPositions;
};

export default getVerticalLayoutPositions;
