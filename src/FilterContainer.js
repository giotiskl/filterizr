import FilterItem from './FilterItem';
import { 
  debounce,
  setStylesOnHTMLNode
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
    this.node = document.querySelector(selector);

    // Set up initial styles of container
    setStylesOnHTMLNode(this.node, {
      padding: 0,
      position: 'relative',
      // Needed for flex displays
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
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
    this.node.removeAttribute('style');
    const filterItemNodes = Array.from(this.node.querySelectorAll('.filtr-item'));
    filterItemNodes.forEach((node) => node.removeAttribute('style'));
    this.unbindEvents();
  }

  /**
   * Iterates over the FilterContainer creating FilterItem 
   * instances for every .filtr-item element found.
   * @param {Object} options - of Filterizr instance
   * @return {Object[]} array of FilterItem instances
   */
  getFilterItems(options) {
    const filterItems = Array.from(this.node.querySelectorAll('.filtr-item'));
    return filterItems.map((node, index) => new FilterItem(node, index, options));
  }

  /**
   * Pushes a new item into the FilterItem array in the properties of the FilterContainer
   * @param {Object} node - jQuery node to instantiate as FilterItem and append to the grid
   * @param {Object} options - Filterizr instance options
   */
  push(node, options) {
    const { FilterItems } = this.props;
    // Add new item to DOM
    this.node.appendChild(node);
    // Initialize it as a FilterItem and push into array
    const index = FilterItems.length;
    const filterItem = new FilterItem(node, index, options);
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

    FilterItems.forEach(FilterItem => setStylesOnHTMLNode(FilterItem.node, {
      'transition': `all ${animationDuration}s ${easing} ${FilterItem.calcDelay(delay, delayMode)}ms`,
    }));
  }

  /**
   * Updates the height of the FilterContainer prop and sets it as an inline style
   * @param {Number} newHeight - the new value of the CSS height property
   */
  updateHeight(newHeight) {
    this.props.h = newHeight;
    setStylesOnHTMLNode(this.node, { height: `${newHeight}px`});
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
    return this.node.clientWidth;
  }

  /**
   * Binds the FilterContainer transitionEnd event, which serves as the
   * space to trigger Filterizr related events, e.g. onFilteringEnd etc.
   * @param {Function} callback for the transitionEnd event
   * @param {Number} debounceDuration in milliseconds
   */
  bindTransitionEnd(callback, debounceDuration) {
    this.props.onTransitionEndHandler = debounce(() => {
      callback();
    }, debounceDuration);

    this.node.addEventListener('webkitTransitionEnd', this.props.onTransitionEndHandler);
    this.node.addEventListener('otransitionend', this.props.onTransitionEndHandler);
    this.node.addEventListener('oTransitionEnd', this.props.onTransitionEndHandler);
    this.node.addEventListener('msTransitionEnd', this.props.onTransitionEndHandler);
    this.node.addEventListener('transitionend', this.props.onTransitionEndHandler);
  }

  /**
   * Binds all Filterizr related events.
   * @param {Object} callbacks object containing all callback functions
   */
  bindEvents(callbacks) {
    this.node.addEventListener('filteringStart', callbacks.addEventListenerFilteringStart);
    this.node.addEventListener('filteringEnd', callbacks.addEventListenerFilteringEnd);
    this.node.addEventListener('shufflingStart', callbacks.addEventListenerShufflingStart);
    this.node.addEventListener('shufflingEnd', callbacks.addEventListenerShufflingEnd);
    this.node.addEventListener('sortingStart', callbacks.addEventListenerSortingStart);
    this.node.addEventListener('sortingEnd', callbacks.addEventListenerSortingEnd);
  }

  /**
   * Unbinds all Filterizr related events.
   */
  unbindEvents(callbacks) {
    // Transition end
    this.node.removeEventListener('webkitTransitionEnd', this.props.onTransitionEndHandler);
    this.node.removeEventListener('otransitionend', this.props.onTransitionEndHandler);
    this.node.removeEventListener('oTransitionEnd', this.props.onTransitionEndHandler);
    this.node.removeEventListener('msTransitionEnd', this.props.onTransitionEndHandler);
    this.node.removeEventListener('transitionend', this.props.onTransitionEndHandler);
    // Rest
    this.node.removeEventListener('filteringStart', callbacks.removeEventListenerFilteringStart);
    this.node.removeEventListener('filteringEnd', callbacks.removeEventListenerFilteringEnd);
    this.node.removeEventListener('shufflingStart', callbacks.removeEventListenerShufflingStart);
    this.node.removeEventListener('shufflingEnd', callbacks.removeEventListenerShufflingEnd);
    this.node.removeEventListener('sortingStart', callbacks.removeEventListenerSortingStart);
    this.node.removeEventListener('sortingEnd', callbacks.removeEventListenerSortingEnd);
  }

  /**
   * Method wrapper around jQuery's trigger
   * @param {string} eventType - name of the event
   */
  trigger(eventType) {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }
}

export default FilterContainer;
