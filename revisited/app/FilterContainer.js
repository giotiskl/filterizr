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

  destroy() {
    // Remove all inline styles and unbind all events
    this.$node
      .attr('style', '')
      .find('.filtr-item')
      .attr('style', '');
    this.unbindEvents();
  }

  getFilterItems(options) {
    const FilterItems = $.map(this.$node.find('.filtr-item'), (item, index) => {
      return new FilterItem($(item), index, options);
    });

    return FilterItems;
  }

  push($node, options) {
    const { FilterItems } = this.props;
    // Add new item to DOM
    this.$node.append($node);
    // Initialize it as a FilterItem and push into array
    const index = FilterItems.length;
    const filterItem = new FilterItem($node, index, options);
    this.props.FilterItems.push(filterItem);
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

  bindEvents(callbacks) {
    this.$node.on('filteringStart.Filterizr', callbacks.onFilteringStart);
    this.$node.on('filteringEnd.Filterizr', callbacks.onFilteringEnd);
    this.$node.on('shufflingStart.Filterizr', callbacks.onShufflingStart);
    this.$node.on('shufflingEnd.Filterizr', callbacks.onShufflingEnd);
    this.$node.on('sortingStart.Filterizr', callbacks.onSortingStart);
    this.$node.on('sortingEnd.Filterizr', callbacks.onSortingEnd);
  }

  unbindEvents() {
    this.$node.off(
      `filteringStart.Filterizr 
      filteringEnd.Filterizr 
      shufflingStart.Filterizr 
      shufflingEnd.Filterizr 
      sortingStart.Filterizr 
      sortingEnd.Filterizr`
    );
  }

  //- Event helpers
  /**
   * Method wrapper around jQuery's trigger
   * @param {string} evt name of the event
   */
  trigger(evt) {
    this.$node.trigger(evt);
  }
}

export default FilterContainer;
