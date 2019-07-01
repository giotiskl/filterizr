import { Position } from '../FilterItem';
import Packer from './Packer';
import Filterizr from '../Filterizr';

/**
 * Packed layout for items that can have varying width as well as varying height.
 * @param {object} filterizr instance.
 */
const getPackedLayoutPositions = (filterizr: Filterizr): Position[] => {
  const { filterContainer } = filterizr.props;
  const filteredItems = filterizr.props.filterItems.getFiltered(
    filterizr.options.get().filter.get()
  );

  //Instantiate new Packer, set up grid
  const packer = new Packer(filterContainer.props.w);
  const filterItemsDimensions = filteredItems.map(({ props }): any => ({
    w: props.w,
    h: props.h,
  }));

  // Enhance array with coordinates
  // added in an extra object named fit
  // by the packing algorithm
  packer.fit(filterItemsDimensions);

  const targetPositions = filterItemsDimensions.map(
    ({ fit }: any): Position => ({
      left: fit.x,
      top: fit.y,
    })
  );

  // set height of container
  filterContainer.updateHeight(packer.root.h);

  return targetPositions;
};

export default getPackedLayoutPositions;
