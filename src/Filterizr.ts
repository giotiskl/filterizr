import BrowserWindow from './BrowserWindow';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import FilterItem from './FilterItem';
import { Filter } from './ActiveFilter';
import getLayoutPositions from './getLayoutPositions';
import defaultOptions, {
  IUserOptions,
} from './FilterizrOptions/defaultOptions';
import _installAsJQueryPlugin from './installAsJQueryPlugin';
import {
  FILTERIZR_STATE,
  allStringsOfArray1InArray2,
  debounce,
  filterItemArraysHaveSameSorting,
  intersection,
  shuffle,
  sortBy,
} from './utils';

class Filterizr {
  FilterContainer: FilterContainer;
  FilterItem: FilterItem;
  defaultOptions: IUserOptions;

  options: FilterizrOptions;
  props: {
    browserWindow: BrowserWindow;
    filterContainer: FilterContainer;
    filterControls?: FilterControls;
    filterItems: FilterItem[];
    filteredItems: FilterItem[];
    filterizrState: string;
    searchTerm: string;
    sort: string;
    sortOrder: string;
  };

  /**
   * Filterizr classes
   */
  static FilterContainer = FilterContainer;
  static FilterItem = FilterItem;
  static defaultOptions = defaultOptions;
  /**
   * Static method that receives the jQuery object and extends
   * its prototype with a .filterizr method.
   */
  static installAsJQueryPlugin = _installAsJQueryPlugin;

  constructor(
    selectorOrNode: string | HTMLElement = defaultOptions.gridSelector,
    userOptions: IUserOptions = {}
  ) {
    const filterContainerNode =
      typeof selectorOrNode === 'string'
        ? document.querySelector(selectorOrNode)
        : selectorOrNode;

    this.options = new FilterizrOptions(userOptions);

    const filterContainer = new FilterContainer(
      filterContainerNode,
      this.options
    );

    const { setupControls, controlsSelector, filter } = this.options.get();

    this.props = {
      browserWindow: new BrowserWindow(),
      filterContainer: filterContainer,
      ...(setupControls && {
        filterControls: new FilterControls(this, controlsSelector),
      }),
      filterItems: filterContainer.props.filterItems,
      filteredItems: [],
      filterizrState: FILTERIZR_STATE.IDLE,
      searchTerm: '',
      sort: 'index',
      sortOrder: 'asc',
    };

    // Set up events needed by Filterizr
    this._bindEvents();

    // Init Filterizr
    this.filter(filter.get());
  }

  /**
   * Public API of Filterizr
   */

  /**
   * Filters the items in the grid by a category
   * @param {String|String[]} category by which to filter
   * @returns {undefined}
   */
  filter(category: Filter): void {
    const { searchTerm, filterContainer, filterItems } = this.props;

    // Trigger filteringStart event
    filterContainer.trigger('filteringStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.FILTERING;

    // Cast category to string or array of strings
    category = Array.isArray(category)
      ? category.map(c => c.toString())
      : category.toString();

    // Update filter in options
    this.options.get().filter.set(category);

    // First filter items then apply search if a search term exists
    const filteredItems = this._filter(filterItems);
    const filteredAndSearchedItems = this._search(filteredItems, searchTerm);

    this.props.filteredItems = filteredAndSearchedItems;

    this._render(filteredItems);
  }

  /**
   * Destroys the Filterizr instance and unbinds all events.
   * @returns {undefined}
   */
  destroy(): void {
    const { browserWindow, filterControls, filterContainer } = this.props;

    // Unbind all events of FilterContainer and Filterizr
    // and remove inline styles.
    filterContainer.destroy();
    browserWindow.destroy();

    // Destroy all controls of the instance
    if (this.options.get().setupControls && filterControls) {
      filterControls.destroy();
    }
  }

  /**
   * Inserts a new FilterItem in the Filterizr grid
   * @param {Object} node DOM node to append
   * @returns {undefined}
   */
  insertItem(node: HTMLElement): void {
    const { filterContainer } = this.props;

    // Add the item to the FilterContainer
    const nodeModified = <Element>node.cloneNode(true);
    nodeModified.removeAttribute('style');

    filterContainer.push(nodeModified, this.options);

    // Retrigger filter for new item to assume position in the grid
    const filteredItems = this._filter(this.props.filterItems);

    this._render(filteredItems);
  }

  /**
   * Sorts the FilterItems in the grid
   * @param {String} sortAttr the attribute by which to perform the sort
   * @param {String} sortOrder ascending or descending
   */
  sort(sortAttr: string = 'index', sortOrder: string = 'asc'): void {
    const { filterContainer, filterItems } = this.props;

    // Trigger filteringStart event
    filterContainer.trigger('sortingStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.SORTING;

    // Update sortOrder in props
    this.props.sortOrder = sortOrder;

    // Sort main array
    this.props.filterItems = this._sort(filterItems, sortAttr, sortOrder);

    // Apply filters
    const filteredItems = this._filter(this.props.filterItems);

    this.props.filteredItems = filteredItems;

    this._render(filteredItems);
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param {String} searchTerm the term for which to search
   */
  search(searchTerm: string = this.props.searchTerm): void {
    const { filterItems } = this.props;

    // Update search term
    this.props.searchTerm = searchTerm.toLowerCase();

    // Filter items and optionally apply search if a search term exists
    const filteredItems = this._search(this._filter(filterItems), searchTerm);

    this.props.filteredItems = filteredItems;

    this._render(filteredItems);
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  shuffle(): void {
    const { filterContainer } = this.props;

    filterContainer.trigger('shufflingStart');

    this.props.filterizrState = FILTERIZR_STATE.SHUFFLING;

    // Get the indices of the Filtered items in the Filter items array before
    // shuffling begins, to update the FilterItems collection after shuffling
    const indicesBeforeShuffling = this.props.filteredItems
      .map(filterItem => this.props.filterItems.indexOf(filterItem))
      .slice();

    // Shuffle filtered items
    this.props.filteredItems = this._shuffle(this.props.filteredItems);

    // Update the FilterItems to have them in the shuffled order
    this.props.filteredItems.forEach((filterItem, index) => {
      const newIndex = indicesBeforeShuffling[index];
      this.props.filterItems = Object.assign([], this.props.filterItems, {
        [newIndex]: filterItem,
      });
    });

    this._render(this.props.filteredItems);
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param {Object} newOptions to override the defaults.
   * @returns {undefined}
   */
  setOptions(newOptions: IUserOptions): void {
    if (newOptions.callbacks) {
      // If user has passed in a callback, deregister the old ones
      this.props.filterContainer.unbindEvents(this.options.get().callbacks);
    }

    // Update options
    this.options.set(newOptions);

    // If one of the options that updates the transition properties
    // of the grid items is set, call the update method
    if (
      newOptions.animationDuration ||
      newOptions.delay ||
      newOptions.delayMode ||
      newOptions.easing
    ) {
      this.props.filterContainer.updateFilterItemsTransitionStyle(
        this.options.getRaw()
      );
    }

    // If inside the new options the callbacks object has been defined
    // then the FilterContainer events need to be reset.
    // Same if the animationDuration is defined as it is a parameter to
    // the debounce wrapper of the transitionEnd callback.
    if (newOptions.callbacks || newOptions.animationDuration) {
      this._rebindFilterContainerEvents();
    }

    // If filter or filtering logic has been changed retrigger filtering
    if (newOptions.filter || newOptions.multifilterLogicalOperator) {
      this.filter(this.options.get().filter.get());
    }
  }

  /**
   * Performs multifiltering with AND/OR logic.
   * @param {String} toggledFilter the filter to toggle
   * @returns {undefined}
   */
  toggleFilter(toggledFilter: string): void {
    this.options.get().filter.toggle(toggledFilter);
    this.filter(this.options.get().filter.get());
  }

  // Helper methods
  private _filter(filterItems: FilterItem[]): FilterItem[] {
    if (this.options.get().filter.get() === 'all') {
      return filterItems;
    }

    return filterItems.filter(filterItem => {
      const categories = filterItem.getCategories();
      return this._shouldBeFiltered(categories);
    });
  }

  /**
   * Determines if item should be filtered or not based on target
   * categories being activated and the current filtering logic
   * @param  {string[]} categories active
   * @returns {undefined}
   */
  private _shouldBeFiltered(categories: string[]): boolean {
    const { multifilterLogicalOperator } = this.options.get();
    const filter = this.options.get().filter.get();
    const isMultifilteringEnabled = Array.isArray(filter);

    if (!isMultifilteringEnabled) {
      return categories.includes(<string>filter);
    }

    if (multifilterLogicalOperator === 'or') {
      return !!intersection(categories, <string[]>filter).length;
    }

    return allStringsOfArray1InArray2(<string[]>filter, categories);
  }

  private _sort(
    filterItems: FilterItem[],
    sortAttr: string = 'index',
    sortOrder: string = 'asc'
  ): FilterItem[] {
    // Sort the FilterItems and reverse the array if order is descending
    let sortedItems = sortBy(filterItems, (filterItem: FilterItem) => {
      return sortAttr !== 'index' && sortAttr !== 'sortData'
        ? filterItem.props.data[sortAttr] // Search for custom data attrs to sort
        : filterItem.props[sortAttr]; // Otherwise use defaults
    });

    // Return the sorted items with correct order
    return sortOrder === 'asc' ? sortedItems : sortedItems.reverse();
  }

  private _search(
    filterItems: FilterItem[],
    searchTerm: string = this.props.searchTerm
  ): FilterItem[] {
    if (!searchTerm) {
      return filterItems;
    }

    const searchedItems = filterItems.filter(filterItem =>
      filterItem.contentsMatchSearch(searchTerm)
    );

    return searchedItems;
  }

  private _shuffle(filterItems: FilterItem[]): FilterItem[] {
    let shuffledItems = shuffle(filterItems);

    // Shuffle items until they are different from the initial filteredItems
    while (
      filterItems.length > 1 &&
      filterItemArraysHaveSameSorting(filterItems, shuffledItems)
    ) {
      shuffledItems = shuffle(filterItems);
    }

    return shuffledItems;
  }

  private _render(filterItems: FilterItem[]): void {
    const { filterInCss, filterOutCss, layout } = this.options.get();

    // Get items to be filtered out
    const filteredOutItems = this.props.filterItems.filter(filterItem => {
      const categories: string[] = filterItem.getCategories();
      const shouldBeFiltered = this._shouldBeFiltered(categories);
      const contentsMatchSearch: boolean = filterItem.contentsMatchSearch(
        this.props.searchTerm
      );

      return !shouldBeFiltered || !contentsMatchSearch;
    });

    // Filter out old items
    filteredOutItems.forEach(filterItem => {
      filterItem.filterOut(filterOutCss);
    });

    // Determine target positions for items to be filtered in
    const positions = getLayoutPositions(layout, this);

    // Filter in new items
    filterItems.forEach((filterItem, index) => {
      filterItem.filterIn(positions[index], filterInCss);
    });
  }

  private _onTransitionEndCallback(): void {
    const { filterizrState, filterContainer } = this.props;

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

    // Reset filterizrState to idle
    this.props.filterizrState = FILTERIZR_STATE.IDLE;
  }

  private _rebindFilterContainerEvents(): void {
    const { filterContainer } = this.props;
    const { animationDuration, callbacks } = this.options.get();

    // Cancel existing evts
    filterContainer.unbindEvents(callbacks);

    // Rebind evts
    filterContainer.bindEvents({
      ...callbacks,
      onTransitionEnd: <EventListener>(
        debounce(
          this._onTransitionEndCallback.bind(this),
          animationDuration,
          false
        )
      ),
    });
  }

  private _bindEvents(): void {
    const { browserWindow, filterContainer } = this.props;

    // FilterContainer events
    this._rebindFilterContainerEvents();

    // Browser window events
    browserWindow.setResizeEventHandler(() => {
      // Update dimensions of items based on new window size
      filterContainer.updateWidth();
      filterContainer.updateFilterItemsDimensions();
      // Refilter the grid to assume new positions
      this.filter(this.options.get().filter.get());
    });
  }
}

export default Filterizr;
