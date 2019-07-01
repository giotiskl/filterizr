import { RawOptionsCallbacks } from './FilterizrOptions/defaultOptions';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import FilterItem from './FilterItem';
import { setStylesOnHTMLNode, TRANSITION_END_EVENTS } from './utils';
import FilterItems from './FilterItems';

/**
 * Resembles the grid of items within Filterizr.
 */
export default class FilterContainer {
  public node: Element;
  public options: FilterizrOptions;
  public props: {
    filterItems: FilterItems;
    w: number;
    h: number;
    onTransitionEndHandler?: EventListener;
  };

  /**
   * Instantiates a FilterContainer
   * @param node of the FilterContainer instance
   * @param options with which to instantiate the container
   */
  public constructor(node: Element, options: FilterizrOptions) {
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
    const filterItems = this.getFilterItems(this.options);
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
    this.props.filterItems.updateFilterItemsDimensions();
  }

  /**
   * Destroys the FilterContainer instance by unbinding all events and resetting inline styles.
   */
  public destroy(): void {
    // Remove all inline styles and unbind all events
    this.node.removeAttribute('style');
    const filterItemNodes = Array.from(
      this.node.querySelectorAll(this.options.get().gridItemsSelector)
    );
    filterItemNodes.forEach((node): void => node.removeAttribute('style'));
    this.unbindEvents(this.options.get().callbacks);
  }

  /**
   * Iterates over the FilterContainer creating FilterItem
   * instances for every grid item found.
   * @param options - of Filterizr instance
   */
  public getFilterItems(options: FilterizrOptions): FilterItems {
    const filterItemNodes = Array.from(
      this.node.querySelectorAll(options.get().gridItemsSelector)
    );
    const filterItems = filterItemNodes.map(
      (node, index): FilterItem => new FilterItem(node, index, options)
    );
    return new FilterItems(filterItems, options);
  }

  /**
   * Inserts a new item into the grid.
   * @param node - HTML node to instantiate as FilterItem and append to the grid
   * @param options - Filterizr options
   */
  public insertItem(node: Element, options: FilterizrOptions): void {
    const { filterItems } = this.props;
    // Clone node and remove inline styles
    const nodeModified = node.cloneNode(true) as Element;
    nodeModified.removeAttribute('style');
    // Add new item to DOM
    this.node.appendChild(nodeModified);
    // Initialize it as a FilterItem and push into array
    this.props.filterItems.push(
      new FilterItem(nodeModified, filterItems.length, options)
    );
  }

  /**
   * Calculates the amount of columns the Filterizr grid should have
   */
  public calculateColumns(): number {
    return Math.round(this.props.w / this.props.filterItems.getItem(0).props.w);
  }

  /**
   * Updates the height of the FilterContainer prop and sets it as an inline style
   * @param newHeight the new value of the CSS height property
   */
  public updateHeight(newHeight: number): void {
    this.props.h = newHeight;
    setStylesOnHTMLNode(this.node, { height: `${newHeight}px` });
  }

  /**
   * Updates the dimensions of both the container and the items
   */
  public updateDimensions(): void {
    this.updateWidth();
    this.props.filterItems.updateFilterItemsDimensions();
  }

  /**
   * Binds all Filterizr related events.
   * @param callbacks wrapper object
   */
  public bindEvents(callbacks: RawOptionsCallbacks): void {
    // Bind transition end
    this.props.onTransitionEndHandler = callbacks.onTransitionEnd;
    TRANSITION_END_EVENTS.forEach((eventName): void => {
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
   * @param callbacks wrapper object
   */
  public unbindEvents(callbacks: RawOptionsCallbacks): void {
    TRANSITION_END_EVENTS.forEach((eventName): void => {
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
   * @param eventType - name of the event
   */
  public trigger(eventType: string): void {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }

  /**
   * Updates the width of the FilterContainer prop
   */
  private updateWidth(): void {
    this.props.w = this.getWidth();
  }

  /**
   * Gets the clientWidth of the container
   */
  private getWidth(): number {
    return this.node.clientWidth;
  }
}
