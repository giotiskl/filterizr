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
    filterContainer: FilterContainer;
    filterControls?: FilterControls;
    filterItems: FilterItem[];
    filteredItems: FilterItem[];
    filterizrState: string;
    searchTerm: string;
    sort: string;
    sortOrder: string;
    windowResizeHandler?: EventListener;
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
      windowResizeHandler: null,
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
    const filteredItems = this._filter(filterItems, category);
    const filteredAndSearchedItems = this._search(filteredItems, searchTerm);

    this.props.filteredItems = filteredAndSearchedItems;

    this._render(filteredItems);
  }

  /**
   * Destroys the Filterizr instance and unbinds all events.
   * @returns {undefined}
   */
  destroy(): void {
    const { filterControls, filterContainer } = this.props;

    // Unbind all events of FilterContainer and Filterizr
    // and remove inline styles.
    filterContainer.destroy();
    window.removeEventListener('resize', this.props.windowResizeHandler);

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
    const filteredItems = this._filter(
      this.props.filterItems,
      this.options.get().filter.get()
    );

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
    const filteredItems = this._filter(
      this.props.filterItems,
      this.options.get().filter.get()
    );

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
    const filteredItems = this._search(
      this._filter(filterItems, this.options.get().filter.get()),
      searchTerm
    );

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
      const {
        animationDuration,
        easing,
        delay,
        delayMode,
      } = this.options.get();
      this.props.filterContainer.updateFilterItemsTransitionStyle(
        animationDuration,
        easing,
        delay,
        delayMode
      );
    }

    // If inside the new options the callbacks object has been defined
    // then the FilterContainer events need to be reset.
    // Same if the animationDuration is defined as it is a parameter to
    // the debounce wrapper of the transitionEnd callback.
    if (newOptions.callbacks || newOptions.animationDuration) {
      this._rebindFilterContainerEvents();
    }

    // If the filter is explicitly set in the new options object, trigger a refiltering.
    if (newOptions.filter) {
      this.filter(newOptions.filter);
    }

    // If the multifilterLogicalOperator has been defined and its
    // value changed then a refilter should be trigger.
    if (newOptions.multifilterLogicalOperator) {
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
  private _filter(
    filterItems: FilterItem[],
    filters: string | string[]
  ): FilterItem[] {
    const { multifilterLogicalOperator } = this.options.get();

    if (filters === 'all') {
      return filterItems;
    }

    const multiFilteringEnabled = Array.isArray(filters);

    return filterItems.filter(filterItem => {
      const categories = filterItem.getCategories();

      if (!multiFilteringEnabled && typeof filters === 'string') {
        // Simple filtering
        return categories.includes(filters);
      } else if (multiFilteringEnabled && Array.isArray(filters)) {
        // Multifiltering
        if (multifilterLogicalOperator === 'or') {
          return intersection(categories, filters).length;
        }
        return allStringsOfArray1InArray2(filters, categories);
      }
    });
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
    let ShuffledItems = shuffle(filterItems);

    // Shuffle items until they are different from the initial filteredItems
    while (
      filterItems.length > 1 &&
      filterItemArraysHaveSameSorting(filterItems, ShuffledItems)
    ) {
      ShuffledItems = shuffle(filterItems);
    }

    return ShuffledItems;
  }

  private _render(filterItems: FilterItem[]): void {
    const filter = this.options.get().filter.get();
    const {
      filterInCss,
      filterOutCss,
      layout,
      multifilterLogicalOperator,
    } = this.options.get();

    // Get items to be filtered out
    const FilteredOutItems = this.props.filterItems.filter(filterItem => {
      const categories: string[] = filterItem.getCategories();
      const multiFilteringEnabled: boolean = Array.isArray(filter);
      // Flags that determine whether item should be filtered out
      let filtersMatch: boolean;
      const contentsMatchSearch: boolean = filterItem.contentsMatchSearch(
        this.props.searchTerm
      );

      if (multiFilteringEnabled && Array.isArray(filter)) {
        if (multifilterLogicalOperator === 'or') {
          filtersMatch = intersection(categories, filter).length;
        } else {
          filtersMatch = allStringsOfArray1InArray2(filter, categories);
        }
      } else if (!multiFilteringEnabled && typeof filter === 'string') {
        filtersMatch = categories.includes(filter);
      }

      return !filtersMatch || !contentsMatchSearch;
    });

    // Filter out old items
    FilteredOutItems.forEach(filterItem => {
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
    const { filterContainer } = this.props;

    // FilterContainer events
    this._rebindFilterContainerEvents();

    // Generic Filterizr events
    // Filter grid again on window resize
    this.props.windowResizeHandler = <EventListener>debounce(
      () => {
        // Update dimensions of items based on new window size
        filterContainer.updateWidth();
        filterContainer.updateFilterItemsDimensions();
        // Refilter the grid to assume new positions
        this.filter(this.options.get().filter.get());
      },
      250,
      false
    );

    window.addEventListener('resize', this.props.windowResizeHandler);
  }
}

export default Filterizr;
