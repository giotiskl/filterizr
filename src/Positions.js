import HorizontalLayout from './layouts/HorizontalLayout';
import VerticalLayout from './layouts/VerticalLayout';
import SameHeightLayout from './layouts/SameHeightLayout';
import SameWidthLayout from './layouts/SameWidthLayout';
import SameSizeLayout from './layouts/SameSizeLayout';
import PackedLayout from './layouts/PackedLayout';

/**
 * Calculates and returns an array of objects representing
 * the next positions the FilterItems are supposed to assume.
 * @param {String} Layout - name of helper method to be used
 * @param {Object} Filterizr - instance
 * @return {Object} layout to be used by Filterizr
 */
const Positions = (Layout, Filterizr) => {
  switch(Layout) {
    case 'horizontal':
      return HorizontalLayout(Filterizr);
    case 'vertical':
      return VerticalLayout(Filterizr);
    case 'sameHeight':
      return SameHeightLayout(Filterizr);
    case 'sameWidth':
      return SameWidthLayout(Filterizr);
    case 'sameSize':
      return SameSizeLayout(Filterizr);
    case 'packed':
      return PackedLayout(Filterizr);
    default:
      return SameSizeLayout(Filterizr);
  }
};

export default Positions;
