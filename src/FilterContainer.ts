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
  public filterItems: FilterItems;
  public dimensions: {
    width: number;
    height: number;
  };

  private onTransitionEndHandler?: EventListener;

  public constructor(node: Element, options: FilterizrOptions) {
    if (!node) {
      throw new Error(
        'Filterizr: could not initialize container, check the selector or node you passed to the constructor exists.'
      );
    }

    this.node = node;
    this.options = options;
    this.onTransitionEndHandler = null;

    // Set up initial styles of container
    setStylesOnHTMLNode(this.node, {
      padding: 0,
      position: 'relative',
      // Needed for flex displays
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    });

    this.filterItems = this.makeFilterItems(this.options);
    if (!this.filterItems.length) {
      throw new Error(
        "Filterizr: cannot initialize empty container. Make sure the gridItemsSelector option corresponds to the selector of your grid's items"
      );
    }

    this.dimensions = {
      width: this.node.clientWidth,
      height: 0,
    };

    this.filterItems.updateDimensions();
  }

  public destroy(): void {
    this.node.removeAttribute('style');
    this.unbindEvents(this.options.get().callbacks);
    this.filterItems.destroy();
  }

  /**
   * Turn the HTML elements in the grid to FilterItem
   * instances and return a collection of them.
   */
  public makeFilterItems(options: FilterizrOptions): FilterItems {
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
    const nodeModified = node.cloneNode(true) as Element;
    nodeModified.removeAttribute('style');
    this.node.appendChild(nodeModified);
    this.filterItems.push(
      new FilterItem(nodeModified, this.filterItems.length, options)
    );
  }

  public calculateColumns(): number {
    return Math.round(
      this.dimensions.width / this.filterItems.getItem(0).dimensions.width
    );
  }

  public updateDimensions(): void {
    this.updateWidth();
    this.filterItems.updateDimensions();
  }

  public updateHeight(newHeight: number): void {
    this.dimensions.height = newHeight;
    setStylesOnHTMLNode(this.node, { height: `${newHeight}px` });
  }

  public bindEvents(callbacks: RawOptionsCallbacks): void {
    this.onTransitionEndHandler = callbacks.onTransitionEnd;
    TRANSITION_END_EVENTS.forEach((eventName): void => {
      this.node.addEventListener(eventName, this.onTransitionEndHandler);
    });
    // Public Filterizr events
    this.node.addEventListener('filteringStart', callbacks.onFilteringStart);
    this.node.addEventListener('filteringEnd', callbacks.onFilteringEnd);
    this.node.addEventListener('shufflingStart', callbacks.onShufflingStart);
    this.node.addEventListener('shufflingEnd', callbacks.onShufflingEnd);
    this.node.addEventListener('sortingStart', callbacks.onSortingStart);
    this.node.addEventListener('sortingEnd', callbacks.onSortingEnd);
  }

  public unbindEvents(callbacks: RawOptionsCallbacks): void {
    TRANSITION_END_EVENTS.forEach((eventName): void => {
      this.node.removeEventListener(eventName, this.onTransitionEndHandler);
    });
    this.node.removeEventListener('filteringStart', callbacks.onFilteringStart);
    this.node.removeEventListener('filteringEnd', callbacks.onFilteringEnd);
    this.node.removeEventListener('shufflingStart', callbacks.onShufflingStart);
    this.node.removeEventListener('shufflingEnd', callbacks.onShufflingEnd);
    this.node.removeEventListener('sortingStart', callbacks.onSortingStart);
    this.node.removeEventListener('sortingEnd', callbacks.onSortingEnd);
  }

  public trigger(eventType: string): void {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }

  private updateWidth(): void {
    this.dimensions.width = this.node.clientWidth;
  }
}
