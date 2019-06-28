import { IDefaultOptions, IDefaultOptionsCallbacks } from './defaultOptions';
import FilterItem from './FilterItem';
import { setStylesOnHTMLNode, TRANSITION_END_EVENTS } from './utils';

export default class FilterContainer {
  node: Element;
  options: IDefaultOptions;
  props: {
    filterItems: FilterItem[];
    w: number;
    h: number;
    onTransitionEndHandler?: EventListener;
  };

  /**
   * Instantiates a FilterContainer
   * @param {Element} node of the FilterContainer instance
   * @param {Object} options with which to instantiate the container
   * @return {FilterContainer} FilterContainer instance
   */
  constructor(node: Element, options: IDefaultOptions) {
    if (!node) {
      throw new Error(
        'Filterizr: could not initialize container, check the selector or node you passed to the constructor exists.'
      );
    }

    this.node = node;
    this.options = options;

    // Set up initial styles of container
    setStylesOnHTMLNode(this.node, {
      padding: 0,
      position: 'relative',
      // Needed for flex displays
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    });

    // Initialize FilterItems
    const filterItems = this.getFilterItems(options);
    if (!filterItems.length) {
      throw new Error(
        "Filterizr: cannot initialize empty container. Make sure the gridItemsSelector option corresponds to the selector of your grid's items"
      );
    }

    this.props = {
      filterItems,
      w: this.getWidth(),
      h: 0,
      onTransitionEndHandler: null,
    };

    // Update dimensions of contained items on instantiation
    this.updateFilterItemsDimensions();
  }

  /**
   * Destroys the FilterContainer instance by unbinding all events and resetting inline styles.
   */
  destroy(): void {
    // Remove all inline styles and unbind all events
    this.node.removeAttribute('style');
    const filterItemNodes = Array.from(
      this.node.querySelectorAll(this.options.gridItemsSelector)
    );
    filterItemNodes.forEach(node => node.removeAttribute('style'));
    this.unbindEvents(this.options.callbacks);
  }

  /**
   * Iterates over the FilterContainer creating FilterItem
   * instances for every grid item found.
   * @param {Object} options - of Filterizr instance
   * @return {Object[]} array of FilterItem instances
   */
  getFilterItems(options: IDefaultOptions) {
    const filterItems = Array.from(
      this.node.querySelectorAll(options.gridItemsSelector)
    );
    return filterItems.map(
      (node, index) => new FilterItem(node, index, options)
    );
  }

  /**
   * Pushes a new item into the FilterItem array in the properties of the FilterContainer
   * @param {Object} node - HTML node to instantiate as FilterItem and append to the grid
   * @param {Object} options - Filterizr instance options
   */
  push(node: Element, options: IDefaultOptions): void {
    const { filterItems } = this.props;
    // Add new item to DOM
    this.node.appendChild(node);
    // Initialize it as a FilterItem and push into array
    const index = filterItems.length;
    const filterItem = new FilterItem(node, index, options);
    this.props.filterItems.push(filterItem);
  }

  /**
   * Calculates the amount of columns the Filterizr grid should have
   * @returns {number} number of columns for the grid
   */
  calcColumns(): number {
    return Math.round(this.props.w / this.props.filterItems[0].props.w);
  }

  /**
   * Updates the transition inline styles of all contained grid items
   * @param {Number} animationDuration duration of the animation in seconds
   * @param {String} easing function for the animation
   * @param {Number} delay in ms
   * @param {String} delayMode alternate or progressive
   */
  updateFilterItemsTransitionStyle(
    animationDuration: number,
    easing: string,
    delay: number,
    delayMode: 'progressive' | 'alternate'
  ): void {
    const { filterItems } = this.props;

    filterItems.forEach(filterItem =>
      setStylesOnHTMLNode(filterItem.node, {
        transition: `all ${animationDuration}s ${easing} ${filterItem.getTransitionDelay(
          delay,
          delayMode
        )}ms`,
      })
    );
  }

  /**
   * Updates the height of the FilterContainer prop and sets it as an inline style
   * @param {Number} newHeight - the new value of the CSS height property
   * @returns {undefined}
   */
  updateHeight(newHeight: number): void {
    this.props.h = newHeight;
    setStylesOnHTMLNode(this.node, { height: `${newHeight}px` });
  }

  /**
   * Updates the width of the FilterContainer prop
   * @returns {undefined}
   */
  updateWidth(): void {
    this.props.w = this.getWidth();
  }

  /**
   * Updates the dimensions of all FilterItems, used for resizing
   * @returns {undefined}
   */
  updateFilterItemsDimensions(): void {
    const { filterItems } = this.props;
    filterItems.forEach(filterItem => filterItem.updateDimensions());
  }

  /**
   * Gets the clientWidth of the container
   * @returns {number} width of node
   */
  getWidth(): number {
    return this.node.clientWidth;
  }

  /**
   * Binds all Filterizr related events.
   * @param {Object} callbacks wrapper object
   * @returns {undefined}
   */
  bindEvents(callbacks: IDefaultOptionsCallbacks): void {
    // Bind transition end
    this.props.onTransitionEndHandler = callbacks.onTransitionEnd;
    TRANSITION_END_EVENTS.forEach(eventName => {
      this.node.addEventListener(eventName, this.props.onTransitionEndHandler);
    });
    // Public Filterizr events
    this.node.addEventListener('filteringStart', callbacks.onFilteringStart);
    this.node.addEventListener('filteringEnd', callbacks.onFilteringEnd);
    this.node.addEventListener('shufflingStart', callbacks.onShufflingStart);
    this.node.addEventListener('shufflingEnd', callbacks.onShufflingEnd);
    this.node.addEventListener('sortingStart', callbacks.onSortingStart);
    this.node.addEventListener('sortingEnd', callbacks.onSortingEnd);
  }

  /**
   * Unbinds all Filterizr related events.
   * @param {Object} callbacks wrapper object
   * @returns {undefined}
   */
  unbindEvents(callbacks: IDefaultOptionsCallbacks): void {
    TRANSITION_END_EVENTS.forEach(eventName => {
      this.node.removeEventListener(
        eventName,
        this.props.onTransitionEndHandler
      );
    });
    this.node.removeEventListener('filteringStart', callbacks.onFilteringStart);
    this.node.removeEventListener('filteringEnd', callbacks.onFilteringEnd);
    this.node.removeEventListener('shufflingStart', callbacks.onShufflingStart);
    this.node.removeEventListener('shufflingEnd', callbacks.onShufflingEnd);
    this.node.removeEventListener('sortingStart', callbacks.onSortingStart);
    this.node.removeEventListener('sortingEnd', callbacks.onSortingEnd);
  }

  /**
   * Dispatches an event to the container
   * @param {string} eventType - name of the event
   * @returns {undefined}
   */
  trigger(eventType: string): void {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }
}
