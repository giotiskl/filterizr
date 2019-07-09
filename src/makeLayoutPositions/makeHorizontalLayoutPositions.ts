import { Position } from '../types/interfaces';
import FilterContainer from '../FilterContainer';

/**
 * Horizontal layout algorithm that arranges all FilterItems in one row. Their width may vary.
 * @param filterContainer instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const { gutterPixels } = filterContainer.options.get();
  const filteredItems = filterItems.getFiltered(filterContainer.options.filter);

  let left = 0,
    containerHeight = 0;

  const targetPositions = filteredItems.map(
    (filterItem): Position => {
      const { width, height } = filterItem.dimensions;
      const pos = {
        left: left,
        top: 0,
      };

      // update left for next item
      left += width + gutterPixels;
      // check if target height of FilterContainer should be increased
      if (height > containerHeight) containerHeight = height;

      return pos;
    }
  );

  // update the height of the FilterContainer
  filterContainer.setHeight(containerHeight + gutterPixels * 2);

  return targetPositions;
};
