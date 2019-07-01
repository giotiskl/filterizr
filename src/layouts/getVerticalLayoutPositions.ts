import { Position } from '../FilterItem';
import Filterizr from '../Filterizr';

/**
 * Vertical layout algorithm that arranges all FilterItems in one column. Their height may vary.
 * @param {Object} Filterizr instance.
 * @return {Object[]} positions for the items to assume.
 */
const getVerticalLayoutPositions = (filterizr: Filterizr): Position[] => {
  const { filterContainer } = filterizr.props;
  const {
    props: { filterItems },
  } = filterContainer;
  const filteredItems = filterItems.getFiltered(
    filterizr.options.get().filter.get()
  );

  // In this layout top in the end will also
  // be the total height of the FilterContainer
  let top = 0;

  const targetPositions = filteredItems.map(
    (filterItem): Position => {
      const { h } = filterItem.props;
      const pos = {
        left: 0,
        top: top,
      };

      top += h;

      return pos;
    }
  );

  // Update the height of the FilterContainer
  filterContainer.updateHeight(top);

  return targetPositions;
};

export default getVerticalLayoutPositions;
