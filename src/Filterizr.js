let $ = IMPORT_JQUERY ? require('jquery') : window.jQuery;
import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import Positions from './Positions';
import DefaultOptions from './DefaultOptions';
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
  constructor(selector = '.filtr-container', userOptions) {
    // Make the options a property of the Filterizr instance
    // so that we can later easily modify/update them.
    this.options = merge(DefaultOptions, userOptions);

    // Try to find and instantiate the FilterContainer
    const filterContainer = new FilterContainer(selector, this.options);

    if (!filterContainer.$node.length) {
      // Throw because the selector given was not
      // found to initialize a FilterContainer.
      throw new Error(`Filterizr: could not find a container with the selector ${selector}, to initialize Filterizr.`);
    }

    // Setup FilterControls
    new FilterControls(this, this.options.controlsSelector);

    // Define props
    this.props = {
      filterizrState: FILTERIZR_STATE.IDLE,
      searchTerm: '',
      sort: 'index',
      sortOrder: 'asc',
      FilterContainer: filterContainer,
      FilterItems: filterContainer.props.FilterItems,
      FilteredItems: [],
    };

    // Set up events needed by Filterizr
    this.bindEvents();

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
  filter(category) {
    const {
      searchTerm,
      FilterContainer,
      FilterItems,
    } = this.props;

    // Trigger filteringStart event
    FilterContainer.trigger('filteringStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.FILTERING;

    // Cast category to string or array of strings
    category = Array.isArray(category)
      ? category.map(c => c.toString())
      : category.toString();

    // Filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(
      this.filterFilterItems(FilterItems, category),
      searchTerm
    ); 

    // Update props
    this.props.FilteredItems = FilteredItems;

    // Render the items
    this.render(FilteredItems);
  }

  /**
   * Destroys the Filterizr instance and unbinds all events.
   */
  destroy() {
    const { FilterContainer } = this.props;
    const { controlsSelector } = this.options;

    // Unbind all events of FilterContainer and Filterizr
    // and remove inline styles.
    FilterContainer.destroy();
    $(window).off('resize.Filterizr');

    // Destroy all controls of the instance
    $(`${controlsSelector}[data-filter]`).off('click.Filterizr');
    $(`${controlsSelector}[data-multifilter]`).off('click.Filterizr');
    $(`${controlsSelector}[data-shuffle]`).off('click.Filterizr');
    $(`${controlsSelector}[data-search]`).off('keyup.Filterizr');
    $(`${controlsSelector}[data-sortAsc]`).off('click.Filterizr');
    $(`${controlsSelector}[data-sortDesc]`).off('click.Filterizr');
  }

  /**
   * Inserts a new FilterItem in the Filterizr grid
   * @param {Object} $node the jQuery of the HTML item to append
   */
  insertItem($node) {
    const { FilterContainer } = this.props;

    // Add the item to the FilterContainer
    const $nodeModified = $node.clone().attr('style', '');

    FilterContainer.push($nodeModified, this.options);

    // Retrigger filter for new item to assume position in the grid
    const FilteredItems = this.filterFilterItems(this.props.FilterItems, this.options.filter);

    this.render(FilteredItems);
  }

  /**
   * Sorts the FilterItems in the grid
   * @param {String} sortAttr the attribute by which to perform the sort
   * @param {String} sortOrder ascending or descending
   */
  sort(sortAttr = 'index', sortOrder = 'asc') {
    const {
      FilterContainer,
      FilterItems,
    } = this.props;

    // Trigger filteringStart event
    FilterContainer.trigger('sortingStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.SORTING;

    // Sort main array
    this.props.FilterItems = this.sortFilterItems(FilterItems, sortAttr, sortOrder);

    // Apply filters
    const FilteredItems = this.filterFilterItems(this.props.FilterItems, this.options.filter);

    this.props.FilteredItems = FilteredItems;

    // Update and render the sorted items
    this.render(FilteredItems);
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param {String} searchTerm the term for which to search
   */
  search(searchTerm = this.props.searchTerm) {
    const { FilterItems } = this.props;

    // Filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(this.filterFilterItems(FilterItems, this.options.filter), searchTerm);

    this.props.FilteredItems = FilteredItems;

    // Render the items
    this.render(FilteredItems);
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed. 
   */
  shuffle() {
    const {
      FilterContainer,
      FilteredItems,
    } = this.props;

    // Trigger filteringStart event
    FilterContainer.trigger('shufflingStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.SHUFFLING;

    // Generate array of shuffled items
    const ShuffledItems = this.shuffleFilterItems(FilteredItems);

    // Update the FilteredItems to equal the array of the shuffled items
    this.props.FilteredItems = ShuffledItems;

    // Render the items after shuffling
    this.render(ShuffledItems);
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param {Object} newOptions to override the defaults.
   */
  setOptions(newOptions) {
    // error checking
    checkOptionForErrors('animationDuration', newOptions.animationDuration, 'number');
    checkOptionForErrors('callbacks', newOptions.callbacks, 'object');
    checkOptionForErrors('controlsSelector', newOptions.controlsSelector, 'string');
    checkOptionForErrors('delay', newOptions.delay, 'number');
    checkOptionForErrors(
      'easing',
      newOptions.easing,
      'string',
      cssEasingValuesRegexp,
      'https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp'
    );
    checkOptionForErrors(
      'delayMode',
      newOptions.delayMode,
      'string',
      ['progressive', 'alternate']
    );
    checkOptionForErrors('filter', newOptions.filter, 'string|number|array');
    checkOptionForErrors('filterOutCss', newOptions.filterOutCss, 'object');
    checkOptionForErrors('filterInCss', newOptions.filterOutCss, 'object');
    checkOptionForErrors(
      'layout',
      newOptions.layout,
      'string',
      ['sameSize', 'vertical', 'horizontal', 'sameHeight', 'sameWidth', 'packed']
    );
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
    if (newOptions.animationDuration || newOptions.delay || newOptions.delayMode || newOptions.easing) {
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
      this.rebindFilterContainerEvents();
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
   */
  toggleFilter(toggledFilter) {
    let activeFilters = this.options.filter;

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
        activeFilters = activeFilters === toggledFilter
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
  filterFilterItems(FilterItems, filters) {
    const { multifilterLogicalOperator } = this.options;

    // Get filtered items
    const FilteredItems = (filters === 'all')
      ? FilterItems // Return all items
      : FilterItems.filter(FilterItem => { // Return filtered array
        const categories = FilterItem.getCategories();
        const multiFilteringEnabled = Array.isArray(filters);
        if (multiFilteringEnabled) {
          return multifilterLogicalOperator === 'or'
            ? intersection(categories, filters).length
            : allStringsOfArray1InArray2(filters, categories);
        }
        return categories.includes(filters);
      });

    return FilteredItems;
  }

  sortFilterItems(FilterItems, sortAttr = 'index', sortOrder = 'asc') {
    // Sort the FilterItems and reverse the array if order is descending
    let SortedItems = sortBy(FilterItems, (FilterItem) => {
      return (sortAttr !== 'index' && sortAttr !== 'sortData')
        ? FilterItem.props.data[sortAttr] // Search for custom data attrs to sort
        : FilterItem.props[sortAttr]; // Otherwise use defaults
    });

    // Return the sorted items with correct order
    return sortOrder === 'asc'
      ? SortedItems
      : SortedItems.reverse();
  }

  searchFilterItems(FilterItems, searchTerm = this.props.searchTerm) {
    if (!searchTerm) return FilterItems; // exit case when no search is applied

    const SoughtItems = FilterItems.filter(FilterItem => FilterItem.contentsMatchSearch(searchTerm));

    return SoughtItems;
  }

  shuffleFilterItems(FilterItems) {
    let ShuffledItems = shuffle(FilterItems);

    // Shuffle items until they are different from the initial FilteredItems
    while (FilterItems.length > 1 && filterItemArraysHaveSameSorting(FilterItems, ShuffledItems)) {
      ShuffledItems = shuffle(FilterItems);
    }

    return ShuffledItems;
  }

  render(FilterItems) {
    const {
      filter,
      filterInCss,
      filterOutCss,
      layout,
      multifilterLogicalOperator,
    } = this.options;

    // Get items to be filtered out
    const FilteredOutItems = this.props.FilterItems.filter(FilterItem => {
      const categories = FilterItem.getCategories();
      const multiFilteringEnabled = Array.isArray(filter);
      // Flags that determine whether item should be filtered out
      let filtersMatch;
      const contentsMatchSearch = FilterItem.contentsMatchSearch(this.props.searchTerm);

      if (multiFilteringEnabled) {
        filtersMatch = multifilterLogicalOperator === 'or'
          ? intersection(categories, filter).length
          : allStringsOfArray1InArray2(filter, categories);
      } else {
        filtersMatch = categories.includes(filter);
      }

      return !filtersMatch || !contentsMatchSearch;
    });

    // Filter out old items
    FilteredOutItems.forEach(FilterItem => {
      FilterItem.filterOut(filterOutCss);
    });

    // Determine target positions for items to be filtered in
    const PositionsArray = Positions(layout, this);

    // Filter in new items
    FilterItems.forEach((FilterItem, index) => {
      FilterItem.filterIn(PositionsArray[index], filterInCss);
    });
  }

  onTransitionEndCallback() {
    const {
      filterizrState,
      FilterContainer,
    } = this.props;

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

  rebindFilterContainerEvents() {
    const { FilterContainer } = this.props;
    const {
      animationDuration,
      callbacks,
    } = this.options;

    // Cancel existing evts
    FilterContainer.unbindEvents();

    // Rebind evts
    FilterContainer.bindEvents(callbacks);
    FilterContainer.bindTransitionEnd(() => { this.onTransitionEndCallback(); }, animationDuration);
  }

  bindEvents() {
    const { FilterContainer } = this.props;

    // FilterContainer events
    this.rebindFilterContainerEvents();

    // Generic Filterizr events
    // Set up a window resize event to fire refiltering
    $(window).on('resize.Filterizr', debounce(() => {
      // Update dimensions of items based on new window size
      FilterContainer.updateWidth();
      FilterContainer.updateFilterItemsDimensions();

      // Refilter the grid to assume new positions
      this.filter(this.options.filter);
    }, 250));
  }
}

export default Filterizr;
