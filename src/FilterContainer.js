let $ = IMPORT_JQUERY ? require('jquery') : window.jQuery;
import FilterItem from './FilterItem';
import { 
  debounce,
  transitionEndEvt,
} from './utils';

class FilterContainer {
  /**
   * Instantiates a FilterContainer
   * @param {String} selector of the FilterContainer instance
   * @param {Object} options with which to instantiate the container
   * @return {Object} FilterContainer instance
   */
  constructor(selector = '.filtr-container', options) {
    // Cache jQuery node
    this.$node = $(selector);

    // Set up initial styles of container
    this.$node.css({
      padding : 0,
      position: 'relative',
      // Needed for flex displays
      width: '100%',
      display: 'flex',
      'flex-wrap': 'wrap',
    });

    // Set props
    this.props = {
      // Other props
      FilterItems: this.getFilterItems(options),
      w: this.getWidth(),
      h: 0,
    };

    // Update dimensions of contained items on instantiation
    this.updateFilterItemsDimensions();
  }

  /**
   * Destroys the FilterContainer instance by unbinding all events and resetting inline styles.
   */
  destroy() {
    // Remove all inline styles and unbind all events
    this.$node
      .attr('style', '')
      .find('.filtr-item')
      .attr('style', '');
    this.unbindEvents();
  }

  /**
   * Iterates over the FilterContainer creating FilterItem 
   * instances for every .filtr-item element found.
   * @param {Object} options - of Filterizr instance
   * @return {Object[]} array of FilterItem instances
   */
  getFilterItems(options) {
    const FilterItems = $.map(this.$node.find('.filtr-item'), (item, index) => {
      return new FilterItem($(item), index, options);
    });

    return FilterItems;
  }

  /**
   * Pushes a new item into the FilterItem array in the properties of the FilterContainer
   * @param {Object} $node - jQuery node to instantiate as FilterItem and append to the grid
   * @param {Object} options - Filterizr instance options
   */
  push($node, options) {
    const { FilterItems } = this.props;
    // Add new item to DOM
    this.$node.append($node);
    // Initialize it as a FilterItem and push into array
    const index = FilterItems.length;
    const filterItem = new FilterItem($node, index, options);
    this.props.FilterItems.push(filterItem);
  }

  /**
   * Calculates the amount of columns the Filterizr grid should have
   */
  calcColumns() {
    return Math.round(this.props.w / this.props.FilterItems[0].props.w);
  }

  /**
   * Updates the transition inline styles of all contained .filtr-item children
   * @param {Number} animationDuration duration of the animation in seconds
   * @param {String} easing function for the animation
   * @param {Number} delay in ms
   * @param {String} delayMode alternate or progressive
   */
  updateFilterItemsTransitionStyle(animationDuration, easing, delay, delayMode) {
    const { FilterItems } = this.props;

    FilterItems.forEach(FilterItem => FilterItem.$node.css({
      'transition': `all ${animationDuration}s ${easing} ${FilterItem.calcDelay(delay, delayMode)}ms`,
    }));
  }

  /**
   * Updates the height of the FilterContainer prop and sets it as an inline style
   * @param {Number} newHeight - the new value of the CSS height property
   */
  updateHeight(newHeight) {
    this.props.h = newHeight;
    this.$node.css('height', newHeight);    
  }

  /**
   * Updates the width of the FilterContainer prop
   */
  updateWidth() {
    this.props.w = this.getWidth();
  }

  /**
   * Updates the dimensions of all FilterItems, used for resizing
   */
  updateFilterItemsDimensions() {
    const { FilterItems } = this.props;
    FilterItems.forEach(FilterItem => FilterItem.updateDimensions());
  }

  /**
   * Wrapper call around jQuery's innerWidth
   */
  getWidth() {
    return this.$node.innerWidth();
  }

  /**
   * Binds the FilterContainer transitionEnd event, which serves as the
   * space to trigger Filterizr related events, e.g. onFilteringEnd etc.
   * @param {Function} callback for the transitionEnd event
   * @param {Number} debounceDuration in milliseconds
   */
  bindTransitionEnd(callback, debounceDuration) {
    this.$node.on(transitionEndEvt, debounce(() => {
      callback();
    }, debounceDuration));
  }

  /**
   * Binds all Filterizr related events.
   * @param {Object} callbacks object containing all callback functions
   */
  bindEvents(callbacks) {
    this.$node.on('filteringStart.Filterizr', callbacks.onFilteringStart);
    this.$node.on('filteringEnd.Filterizr', callbacks.onFilteringEnd);
    this.$node.on('shufflingStart.Filterizr', callbacks.onShufflingStart);
    this.$node.on('shufflingEnd.Filterizr', callbacks.onShufflingEnd);
    this.$node.on('sortingStart.Filterizr', callbacks.onSortingStart);
    this.$node.on('sortingEnd.Filterizr', callbacks.onSortingEnd);
  }

  /**
   * Unbinds all Filterizr related events.
   */
  unbindEvents() {
    this.$node.off(
      `${transitionEndEvt}
      filteringStart.Filterizr 
      filteringEnd.Filterizr 
      shufflingStart.Filterizr 
      shufflingEnd.Filterizr 
      sortingStart.Filterizr 
      sortingEnd.Filterizr`
    );
  }

  /**
   * Method wrapper around jQuery's trigger
   * @param {string} evt - name of the event
   */
  trigger(evt) {
    this.$node.trigger(evt);
  }
}

export default FilterContainer;
