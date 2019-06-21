import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import FilterItem from './FilterItem';
import Positions from './Positions';
import DefaultOptions, { IDefaultOptions } from './DefaultOptions';
import {
  FILTERIZR_STATE,
  allStringsOfArray1InArray2,
  checkOptionForErrors,
  cssEasingValuesRegexp,
  debounce,
  filterItemArraysHaveSameSorting,
  intersection,
  merge,
  shuffle,
  sortBy,
} from './utils';

class Filterizr {
  options: IDefaultOptions;
  props: {
    FilterContainer: FilterContainer;
    FilterControls: FilterControls;
    FilterItems: FilterItem[];
    FilteredItems: FilterItem[];
    filterizrState: string;
    searchTerm: string;
    sort: string;
    sortOrder: string;
    windowResizeHandler?: EventListener;
  };

  constructor(
    selector: string = '.filtr-container',
    userOptions: IDefaultOptions
  ) {
    // Make the options a property of the Filterizr instance
    // so that we can later easily modify/update them.
    this.options = merge(DefaultOptions, userOptions);

    // Try to find and instantiate the FilterContainer
    const filterContainer = new FilterContainer(selector, this.options);

    if (!filterContainer.node) {
      // Throw because the selector given was not
      // found to initialize a FilterContainer.
      throw new Error(
        'Filterizr: could not find a container with ' +
          `the selector ${selector}, to initialize Filterizr.`
      );
    }

    // Setup FilterControls
    const filterControls = new FilterControls(
      this,
      this.options.controlsSelector
    );
    filterControls.initialize();

    // Define props
    this.props = {
      FilterContainer: filterContainer,
      FilterControls: filterControls,
      FilterItems: filterContainer.props.FilterItems,
      FilteredItems: [],
      filterizrState: FILTERIZR_STATE.IDLE,
      searchTerm: '',
      sort: 'index',
      sortOrder: 'asc',
      windowResizeHandler: null,
    };

    // Set up events needed by Filterizr
    this._bindEvents();

    // Init Filterizr
    this.filter(this.options.filter);
  }

  /**
   * Public API of Filterizr
   */

  /**
   * Filters the items in the grid by a category
   * @param {String} category by which to filter
   */
  filter(category: string | string[]): void {
    const { searchTerm, FilterContainer, FilterItems } = this.props;

    // Trigger filteringStart event
    FilterContainer.trigger('filteringStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.FILTERING;

    // Cast category to string or array of strings
    category = Array.isArray(category)
      ? category.map(c => c.toString())
      : category.toString();

    // Filter items and optionally apply search if a search term exists
    const FilteredItems = this._search(
      this._filter(FilterItems, category),
      searchTerm
    );

    this.props.FilteredItems = FilteredItems;

    this._render(FilteredItems);
  }

  /**
   * Destroys the Filterizr instance and unbinds all events.
   * @returns {undefined}
   */
  destroy(): void {
    const { FilterControls, FilterContainer } = this.props;

    // Unbind all events of FilterContainer and Filterizr
    // and remove inline styles.
    FilterContainer.destroy();
    window.removeEventListener('resize', this.props.windowResizeHandler);

    // Destroy all controls of the instance
    FilterControls.destroy();
  }

  /**
   * Inserts a new FilterItem in the Filterizr grid
   * @param {Object} node DOM node to append
   * @returns {undefined}
   */
  insertItem(node: HTMLElement): void {
    const { FilterContainer } = this.props;

    // Add the item to the FilterContainer
    const nodeModified = <Element>node.cloneNode(true);
    nodeModified.removeAttribute('style');

    FilterContainer.push(nodeModified, this.options);

    // Retrigger filter for new item to assume position in the grid
    const FilteredItems = this._filter(
      this.props.FilterItems,
      this.options.filter
    );

    this._render(FilteredItems);
  }

  /**
   * Sorts the FilterItems in the grid
   * @param {String} sortAttr the attribute by which to perform the sort
   * @param {String} sortOrder ascending or descending
   */
  sort(sortAttr: string = 'index', sortOrder: string = 'asc'): void {
    const { FilterContainer, FilterItems } = this.props;

    // Trigger filteringStart event
    FilterContainer.trigger('sortingStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.SORTING;

    // Sort main array
    this.props.FilterItems = this._sort(FilterItems, sortAttr, sortOrder);

    // Apply filters
    const FilteredItems = this._filter(
      this.props.FilterItems,
      this.options.filter
    );

    this.props.FilteredItems = FilteredItems;

    this._render(FilteredItems);
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param {String} searchTerm the term for which to search
   */
  search(searchTerm: string = this.props.searchTerm): void {
    const { FilterItems } = this.props;

    // Filter items and optionally apply search if a search term exists
    const FilteredItems = this._search(
      this._filter(FilterItems, this.options.filter),
      searchTerm
    );

    this.props.FilteredItems = FilteredItems;

    this._render(FilteredItems);
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  shuffle(): void {
    const { FilterContainer, FilteredItems } = this.props;

    // Trigger filteringStart event
    FilterContainer.trigger('shufflingStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.SHUFFLING;

    // Generate array of shuffled items
    const ShuffledItems = this._shuffle(FilteredItems);

    // Update the FilteredItems to equal the array of the shuffled items
    this.props.FilteredItems = ShuffledItems;

    this._render(ShuffledItems);
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param {Object} newOptions to override the defaults.
   * @returns {undefined}
   */
  setOptions(newOptions: IDefaultOptions): void {
    // error checking
    checkOptionForErrors(
      'animationDuration',
      newOptions.animationDuration,
      'number'
    );
    checkOptionForErrors('callbacks', newOptions.callbacks, 'object');
    checkOptionForErrors(
      'controlsSelector',
      newOptions.controlsSelector,
      'string'
    );
    checkOptionForErrors('delay', newOptions.delay, 'number');
    checkOptionForErrors(
      'easing',
      newOptions.easing,
      'string',
      cssEasingValuesRegexp,
      'https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp'
    );
    checkOptionForErrors('delayMode', newOptions.delayMode, 'string', [
      'progressive',
      'alternate',
    ]);
    checkOptionForErrors('filter', newOptions.filter, 'string|number|array');
    checkOptionForErrors('filterOutCss', newOptions.filterOutCss, 'object');
    checkOptionForErrors('filterInCss', newOptions.filterOutCss, 'object');
    checkOptionForErrors('layout', newOptions.layout, 'string', [
      'sameSize',
      'vertical',
      'horizontal',
      'sameHeight',
      'sameWidth',
      'packed',
    ]);
    checkOptionForErrors(
      'multifilterLogicalOperator',
      newOptions.multifilterLogicalOperator,
      'string',
      ['and', 'or']
    );
    checkOptionForErrors('setupControls', newOptions.setupControls, 'boolean');

    // Merge options
    this.options = merge(this.options, newOptions);

    // If one of the options that updates the transition properties
    // of the .filtr-item elements is set, call the update method
    if (
      newOptions.animationDuration ||
      newOptions.delay ||
      newOptions.delayMode ||
      newOptions.easing
    ) {
      this.props.FilterContainer.updateFilterItemsTransitionStyle(
        newOptions.animationDuration,
        newOptions.easing,
        newOptions.delay,
        newOptions.delayMode
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
      this.filter(this.options.filter);
    }
  }

  /**
   * Performs multifiltering with AND/OR logic.
   * @param {String} toggledFilter the filter to toggle
   * @returns {undefined}
   */
  toggleFilter(toggledFilter: string): void {
    let activeFilters: string | string[] = this.options.filter;

    if (activeFilters === 'all') {
      // If set to all then just set to new category
      activeFilters = toggledFilter;
    } else {
      if (Array.isArray(activeFilters)) {
        // If the activeFilters are an array
        if (activeFilters.includes(toggledFilter)) {
          // Check if the toggledFilter is in the array and remove it
          activeFilters = activeFilters.filter(f => f !== toggledFilter);
          // In case there is only 1 item now left in the array, flatten it
          if (activeFilters.length === 1) activeFilters = activeFilters[0];
        } else {
          // If the item is not in the array then simply push it
          activeFilters.push(toggledFilter);
        }
      } else {
        activeFilters =
          activeFilters === toggledFilter
            ? 'all' // If the activeFilters === toggledFilter revert to 'all'
            : [activeFilters, toggledFilter]; // Otherwise start array
      }
    }

    // Update active filter in Filterizr's options
    this.options.filter = activeFilters;

    // Trigger a refilter
    this.filter(this.options.filter);
  }

  // Helper methods
  private _filter(
    FilterItems: FilterItem[],
    filters: string | string[]
  ): FilterItem[] {
    const { multifilterLogicalOperator } = this.options;

    if (filters === 'all') {
      return FilterItems;
    }

    const multiFilteringEnabled = Array.isArray(filters);

    return FilterItems.filter(FilterItem => {
      const categories = FilterItem.getCategories();

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
    FilterItems: FilterItem[],
    sortAttr: string = 'index',
    sortOrder: string = 'asc'
  ): FilterItem[] {
    // Sort the FilterItems and reverse the array if order is descending
    let SortedItems = sortBy(FilterItems, (FilterItem: FilterItem) => {
      return sortAttr !== 'index' && sortAttr !== 'sortData'
        ? FilterItem.props.data[sortAttr] // Search for custom data attrs to sort
        : FilterItem.props[sortAttr]; // Otherwise use defaults
    });

    // Return the sorted items with correct order
    return sortOrder === 'asc' ? SortedItems : SortedItems.reverse();
  }

  private _search(
    FilterItems: FilterItem[],
    searchTerm: string = this.props.searchTerm
  ): FilterItem[] {
    if (!searchTerm) {
      return FilterItems;
    }

    const SoughtItems = FilterItems.filter(FilterItem =>
      FilterItem.contentsMatchSearch(searchTerm)
    );

    return SoughtItems;
  }

  private _shuffle(FilterItems: FilterItem[]): FilterItem[] {
    let ShuffledItems = shuffle(FilterItems);

    // Shuffle items until they are different from the initial FilteredItems
    while (
      FilterItems.length > 1 &&
      filterItemArraysHaveSameSorting(FilterItems, ShuffledItems)
    ) {
      ShuffledItems = shuffle(FilterItems);
    }

    return ShuffledItems;
  }

  private _render(FilterItems: FilterItem[]): void {
    const {
      filter,
      filterInCss,
      filterOutCss,
      layout,
      multifilterLogicalOperator,
    } = this.options;

    // Get items to be filtered out
    const FilteredOutItems = this.props.FilterItems.filter(FilterItem => {
      const categories: string[] = FilterItem.getCategories();
      const multiFilteringEnabled: boolean = Array.isArray(filter);
      // Flags that determine whether item should be filtered out
      let filtersMatch: boolean;
      const contentsMatchSearch: boolean = FilterItem.contentsMatchSearch(
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
    FilteredOutItems.forEach(FilterItem => {
      FilterItem.filterOut(filterOutCss);
    });

    // Determine target positions for items to be filtered in
    const positions = Positions(layout, this);

    // Filter in new items
    FilterItems.forEach((FilterItem, index) => {
      FilterItem.filterIn(positions[index], filterInCss);
    });
  }

  private _onTransitionEndCallback(): void {
    const { filterizrState, FilterContainer } = this.props;

    switch (filterizrState) {
      case FILTERIZR_STATE.FILTERING:
        FilterContainer.trigger('filteringEnd');
        break;
      case FILTERIZR_STATE.SORTING:
        FilterContainer.trigger('sortingEnd');
        break;
      case FILTERIZR_STATE.SHUFFLING:
        FilterContainer.trigger('shufflingEnd');
        break;
    }

    // Reset filterizrState to idle
    this.props.filterizrState = FILTERIZR_STATE.IDLE;
  }

  private _rebindFilterContainerEvents(): void {
    const { FilterContainer } = this.props;
    const { animationDuration, callbacks } = this.options;

    // Cancel existing evts
    FilterContainer.unbindEvents(callbacks);

    // Rebind evts
    FilterContainer.bindEvents(callbacks);
    FilterContainer.bindTransitionEnd(() => {
      this._onTransitionEndCallback();
    }, animationDuration);
  }

  private _bindEvents(): void {
    const { FilterContainer } = this.props;

    // FilterContainer events
    this._rebindFilterContainerEvents();

    // Generic Filterizr events
    // Filter grid again on window resize
    this.props.windowResizeHandler = <EventListener>debounce(
      () => {
        // Update dimensions of items based on new window size
        FilterContainer.updateWidth();
        FilterContainer.updateFilterItemsDimensions();
        // Refilter the grid to assume new positions
        this.filter(this.options.filter);
      },
      250,
      false
    );

    window.addEventListener('resize', this.props.windowResizeHandler);
  }
}

export default Filterizr;
