import { Position } from '../types/interfaces';
import FilterContainer from '../FilterContainer';

/**
 * Vertical layout algorithm that arranges all FilterItems in one column. Their height may vary.
 * @param filterizr instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const { gutterPixels } = filterContainer.options.get();
  const filteredItems = filterItems.getFiltered(filterContainer.options.filter);

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

      top += height + gutterPixels;

      return pos;
    }
  );

  // Update the height of the FilterContainer
  filterContainer.setHeight(top + gutterPixels);

  return targetPositions;
};
