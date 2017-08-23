import FilterItem from './FilterItem';

class FilterContainer {
  constructor(selector = '.filtr-container', options) {
    // cache jQuery node
    this.$node = $(selector);

    // set props
    this.props = {
      // other props
      FilterItems: this.getFilterItems(options),
      w: this.getWidth(),
      h: 0,
    }

    // set up initial styles of container
    this.$node.css({
      'padding' : 0,
      'position': 'relative'
    });
  }

  getFilterItems(options) {
    const FilterItems = $.map(this.$node.find('.filtr-item'), (item, index) => {
      return new FilterItem($(item), index, options);
    });

    return FilterItems;
  }

  calcColumns() {
    return Math.round(this.props.w / this.props.FilterItems[0].props.w);
  }

  // Helpers determining dimensions
  updateHeight(newHeight) {
    this.props.h = newHeight;
    this.$node.css('height', newHeight);    
  }

  updateWidth() {
    this.props.w = this.getWidth();
  }

  updateFilterItemsDimensions() {
    const {
      FilterItems
    } = this.props;

    this.props.FilterItems.forEach(FilterItem => FilterItem.updateDimensions());
  }

  getWidth() {
    return this.$node.innerWidth();
  }

  //- Event helpers
  /**
   * Method wrapper around jQuery's trigger
   * @param {string} evt name of the event
   */
  trigger(evt) {
    this.$node.trigger(evt);
  }

  /**
   * Method wrapper around jQuery's off
   * @param {string} evt name of the event
   * @param {function} cb callback to execute on event
   */
  off(evt, cb) {
    this.$node.off(evt, cb);
  }

  /**
   * Method wrapper around jQuery's on
   * @param {string} evt name of the event
   * @param {function} cb callback to execute on event
   */
  on(evt, cb) {
    this.$node.on(evt, cb);
  }
}

export default FilterContainer;
