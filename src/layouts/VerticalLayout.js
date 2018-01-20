/**
 * Vertical layout algorithm that arranges all FilterItems in one col. Their height may vary.
 * @param {object} Filterizr instance.
 */
const VerticalLayout = (Filterizr) => {
  const {
    FilterContainer,
    FilterItems
  } = Filterizr.props;
  // in this layout top in the end will also
  // be the total height of the FilterContainer
  let top = 0;

  const targetPositions = FilterItems.map((FilterItem) => {
    const pos = {
      left: 0,
      top: top,
    };

    top += FilterItem.props.h;

    return pos;
  });

  // update the height of the FilterContainer
  FilterContainer.updateHeight(top);

  return targetPositions;
};

export default VerticalLayout;
