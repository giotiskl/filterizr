import { RawOptionsCallbacks } from './types/interfaces';
import { setStyles } from './utils';
import { TRANSITION_END_EVENTS } from './config';
import FilterizrOptions from './FilterizrOptions';
import FilterItem from './FilterItem';
import FilterItems from './FilterItems';
import EventReceiver from './EventReceiver';

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

  private eventReceiver: EventReceiver;

  public constructor(node: Element, options: FilterizrOptions) {
    if (!node) {
      throw new Error(
        'Filterizr: could not initialize container, check the selector or node you passed to the constructor exists.'
      );
    }

    this.node = node;
    this.options = options;
    this.eventReceiver = new EventReceiver(node);

    // Set up initial styles of container
    setStyles(this.node, {
      padding: `0 ${this.options.get().gutterPixels / 2}px`,
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
    this.unbindEvents();
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
    return Math.floor(
      this.dimensions.width /
        (this.filterItems.getItem(0).dimensions.width +
          this.options.get().gutterPixels)
    );
  }

  public updateDimensions(): void {
    this.updateWidth();
    this.filterItems.updateDimensions();
  }

  public updatePaddings(): void {
    const { gutterPixels } = this.options.get();
    setStyles(this.node, { padding: `0 ${gutterPixels / 2}px` });
  }

  public updateHeight(newHeight: number): void {
    this.dimensions.height = newHeight;
    setStyles(this.node, { height: `${newHeight}px` });
  }

  public bindEvents(callbacks: RawOptionsCallbacks): void {
    TRANSITION_END_EVENTS.forEach((eventName): void => {
      this.eventReceiver.on(eventName, callbacks.onTransitionEnd);
    });
    // Public Filterizr events
    this.eventReceiver.on('filteringStart', callbacks.onFilteringStart);
    this.eventReceiver.on('filteringEnd', callbacks.onFilteringEnd);
    this.eventReceiver.on('shufflingStart', callbacks.onShufflingStart);
    this.eventReceiver.on('shufflingEnd', callbacks.onShufflingEnd);
    this.eventReceiver.on('sortingStart', callbacks.onSortingStart);
    this.eventReceiver.on('sortingEnd', callbacks.onSortingEnd);
  }

  public unbindEvents(): void {
    TRANSITION_END_EVENTS.forEach((eventName): void => {
      this.eventReceiver.off(eventName);
    });
    this.eventReceiver.off('filteringStart');
    this.eventReceiver.off('filteringEnd');
    this.eventReceiver.off('shufflingStart');
    this.eventReceiver.off('shufflingEnd');
    this.eventReceiver.off('sortingStart');
    this.eventReceiver.off('sortingEnd');
  }

  public trigger(eventType: string): void {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }

  private updateWidth(): void {
    this.dimensions.width = this.node.clientWidth;
  }
}
