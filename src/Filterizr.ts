import BrowserWindow from './BrowserWindow';
import FilterizrOptions, {
  defaultOptions,
  RawOptions,
} from './FilterizrOptions';
import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import FilterItem from './FilterItem';
import { Filter } from './ActiveFilter';
import makeLayoutPositions from './makeLayoutPositions';
import installAsJQueryPlugin from './installAsJQueryPlugin';
import { FILTERIZR_STATE, debounce, getHTMLElement, noop } from './utils';
import FilterItems from './FilterItems';

const imagesLoaded = require('imagesloaded');

export default class Filterizr {
  /**
   * Main Filterizr classes exported as static members
   */
  public static FilterContainer = FilterContainer;
  public static FilterItem = FilterItem;
  public static defaultOptions = defaultOptions;

  /**
   * Static method that receives the jQuery object and extends
   * its prototype with a .filterizr method.
   */
  public static installAsJQueryPlugin: Function = installAsJQueryPlugin;

  public options: FilterizrOptions;
  private browserWindow: BrowserWindow;
  private filterContainer: FilterContainer;
  private filterControls?: FilterControls;
  private filterizrState: string;

  public constructor(
    selectorOrNode: string | HTMLElement = '.filtr-container',
    userOptions: RawOptions = {}
  ) {
    this.options = new FilterizrOptions(userOptions);

    const { setupControls, controlsSelector } = this.options.get();

    this.browserWindow = new BrowserWindow();
    this.filterContainer = new FilterContainer(
      getHTMLElement(selectorOrNode),
      this.options
    );
    this.filterizrState = FILTERIZR_STATE.IDLE;

    if (setupControls) {
      this.filterControls = new FilterControls(this, controlsSelector);
    }

    this.bindEvents();

    this.renderWithImagesLoaded(this.options.get().callbacks.onInit);
  }

  private get filterItems(): FilterItems {
    return this.filterContainer.filterItems;
  }

  /**
   * Filters the items in the grid by a category
   * @param category by which to filter
   */
  public filter(category: Filter): void {
    const { filterContainer, filterItems } = this;

    filterContainer.trigger('filteringStart');
    this.filterizrState = FILTERIZR_STATE.FILTERING;

    category = Array.isArray(category)
      ? category.map((c): string => c.toString())
      : category.toString();

    this.options.filter = category;
    this.render(filterItems.getSearched(this.options.searchTerm));
  }

  public destroy(): void {
    const { browserWindow, filterControls, filterContainer } = this;

    filterContainer.destroy();
    browserWindow.destroy();
    if (this.options.get().setupControls && filterControls) {
      filterControls.destroy();
    }
  }

  /**
   * Inserts a new FilterItem in the Filterizr grid
   * @param node DOM node to append
   */
  public insertItem(node: HTMLElement): void {
    this.filterContainer.insertItem(node, this.options);
    this.renderWithImagesLoaded();
  }

  /**
   * Sorts the FilterItems in the grid
   * @param sortAttr the attribute by which to perform the sort
   * @param sortOrder ascending or descending
   */
  public sort(
    sortAttr: string = 'index',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): void {
    const { filterContainer, filterItems } = this;
    filterContainer.trigger('sortingStart');
    this.filterizrState = FILTERIZR_STATE.SORTING;
    this.render(filterItems.getSorted(sortAttr, sortOrder));
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param searchTerm the term for which to search
   */
  public search(searchTerm: string = this.options.get().searchTerm): void {
    this.options.searchTerm = searchTerm.toLowerCase();
    this.render(this.filterItems.getSearched(this.options.searchTerm));
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  public shuffle(): void {
    const { filterContainer, filterItems } = this;
    filterContainer.trigger('shufflingStart');
    this.filterizrState = FILTERIZR_STATE.SHUFFLING;
    this.render(filterItems.getShuffled());
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param newOptions to override the defaults.
   */
  public setOptions(newOptions: RawOptions): void {
    const {
      filterContainer,
      filterItems,
      options: { filter },
    } = this;

    if (newOptions.callbacks) {
      // If callbacks are defined the in the options, the old ones
      // have to be removed while we still have the references to
      // the handlers.
      filterContainer.unbindEvents(this.options.get().callbacks);
    }

    this.options.set(newOptions);

    if (
      newOptions.animationDuration ||
      newOptions.delay ||
      newOptions.delayMode ||
      newOptions.easing
    ) {
      filterItems.updateTransitionStyle();
    }

    if (newOptions.callbacks || newOptions.animationDuration) {
      this.rebindFilterContainerEvents();
    }

    if ('searchTerm' in newOptions) {
      this.search(newOptions.searchTerm);
    }

    if (newOptions.filter || newOptions.multifilterLogicalOperator) {
      this.filter(newOptions.filter || filter);
    }
  }

  /**
   * Performs multifiltering with AND/OR logic.
   * @param toggledFilter the filter to toggle
   */
  public toggleFilter(toggledFilter: string): void {
    this.options.toggleFilter(toggledFilter);
    this.filter(this.options.filter);
  }

  private render(itemsToFilterIn: FilterItem[]): void {
    const {
      filterContainer,
      filterItems,
      options: { filter },
    } = this;
    const { filterInCss, filterOutCss, layout } = this.options.get();

    filterItems.getFilteredOut(filter).forEach((filterItem): void => {
      filterItem.filterOut(filterOutCss);
    });

    const positions = makeLayoutPositions(layout, filterContainer);

    itemsToFilterIn.forEach((filterItem, index): void => {
      filterItem.filterIn(positions[index], filterInCss);
    });
  }

  private onTransitionEndCallback(): void {
    const { filterizrState, filterContainer } = this;

    switch (filterizrState) {
      case FILTERIZR_STATE.FILTERING:
        filterContainer.trigger('filteringEnd');
        break;
      case FILTERIZR_STATE.SORTING:
        filterContainer.trigger('sortingEnd');
        break;
      case FILTERIZR_STATE.SHUFFLING:
        filterContainer.trigger('shufflingEnd');
        break;
    }

    this.filterizrState = FILTERIZR_STATE.IDLE;
  }

  private rebindFilterContainerEvents(): void {
    const { filterContainer } = this;
    const { animationDuration, callbacks } = this.options.get();

    filterContainer.unbindEvents(callbacks);

    filterContainer.bindEvents({
      ...callbacks,
      onTransitionEnd: debounce(
        this.onTransitionEndCallback.bind(this),
        animationDuration,
        false
      ) as EventListener,
    });
  }

  private bindEvents(): void {
    const { browserWindow } = this;
    this.rebindFilterContainerEvents();
    browserWindow.setResizeEventHandler(
      this.updateDimensionsAndRerender.bind(this)
    );
  }

  /**
   * If it contains images it makes use of the imagesloaded npm package
   * to trigger the first render after the images have finished loading
   * in the DOM. Otherwise, overlapping can occur if the images do not
   * have the height attribute explicitly set on them.
   *
   * In case the grid contains no images, then a simple render is performed.
   */
  private renderWithImagesLoaded(onRendered: Function = noop): void {
    const {
      filterContainer,
      filterItems,
      options: { filter },
    } = this;
    const hasImages = !!filterContainer.node.querySelectorAll('img').length;

    if (hasImages) {
      imagesLoaded(filterContainer.node, (): void => {
        this.updateDimensionsAndRerender();
        onRendered();
      });
    } else {
      this.render(filterItems.getFiltered(filter));
      onRendered();
    }
  }

  private updateDimensionsAndRerender(): void {
    const {
      filterContainer,
      filterItems,
      options: { filter },
    } = this;
    filterContainer.updateDimensions();
    this.render(filterItems.getFiltered(filter));
  }
}
