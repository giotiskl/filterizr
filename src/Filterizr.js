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
  stringInArray,
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

    // define props
    this.props = {
      filterizrState: FILTERIZR_STATE.IDLE,
      searchTerm: '',
      sort: 'index',
      sortOrder: 'asc',
      FilterContainer: filterContainer,
      FilterItems: filterContainer.props.FilterItems,
      FilteredItems: [],
    };

    // set up events needed by Filterizr
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
    category = Array.isArray(category) ?
      category.map(c => c.toString()) :
      category.toString();
    
    // Filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(
      this.filterFilterItems(FilterItems, category), 
      searchTerm
    );
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
    $(`${controlsSelector} *[data-filter]`).off('click.Filterizr');
    $(`${controlsSelector} *[data-multifilter]`).off('click.Filterizr');
    $(`${controlsSelector} *[data-shuffle]`).off('click.Filterizr');
    $(`${controlsSelector} *[data-search]`).off('keyup.Filterizr');
    $(`${controlsSelector} *[data-sortAsc]`).off('click.Filterizr');
    $(`${controlsSelector} *[data-sortDesc]`).off('click.Filterizr');
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

    // sort main array
    this.props.FilterItems = this.sortFilterItems(FilterItems, sortAttr, sortOrder);

    // apply filters
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

    // filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(this.filterFilterItems(FilterItems, this.options.filter), searchTerm);
    this.props.FilteredItems = FilteredItems;

    // render the items
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

    const ShuffledItems = this.shuffleFilterItems(FilteredItems);
    this.props.FilteredItems = ShuffledItems;

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
      // if set to all then just set to new category
      activeFilters = toggledFilter;
    }
    else {
      if (Array.isArray(activeFilters)) {
        // if the toggledFilter is already included in the array
        if (stringInArray(activeFilters, toggledFilter)) {
          // then remove it
          activeFilters = activeFilters.filter(f => f !== toggledFilter);          
          // and check if there is now only 1 item left in the array
          if (activeFilters.length === 1)
            // in that case flatten it
            activeFilters = activeFilters[0];
        }
        else {
          // if the item is not in the array then simply push it
          activeFilters.push(toggledFilter);
        }
      }
      else {
        // in case the filter is NOT set to "all" 
        // check if the toggledFilter is the active one
        if (activeFilters === toggledFilter)
          // in this case revert to all
          activeFilters = 'all';
        else
          // otherwise form an array with the two values
          activeFilters = [activeFilters, toggledFilter];
      }
    }

    // update active filter in Filterizr's options
    this.setOptions({
      filter: activeFilters,
    });

    this.filter(this.options.filter);
  }

  // Helper methods
  filterFilterItems(FilterItems, filters) {
    const { multifilterLogicalOperator } = this.options;
    // Get filtered items
    const FilteredItems = (filters === 'all') ?
      // in this case return all items
      FilterItems :
      // otherwise return filtered array
      FilterItems.filter(FilterItem => {
        const categories = FilterItem.getCategories();
        const multiFilteringEnabled = Array.isArray(filters);
        if (multiFilteringEnabled) {
          if (multifilterLogicalOperator === 'or') {
            return intersection(categories, filters).length;
          } else {
            return allStringsOfArray1InArray2(filters, categories);
          }
        } else {
          return stringInArray(categories, filters);
        }
      });

    return FilteredItems;
  }

  sortFilterItems(FilterItems ,sortAttr = 'index', sortOrder = 'asc') {
    // Sort the FilterItems and reverse the array if order is descending
    let SortedItems = sortBy(FilterItems, (FilterItem) => {
      return (sortAttr !== 'index' && sortAttr !== 'sortData') ?
        // if the user has not used one of the two default sort attributes
        // then search for custom data attributes on the filter items to sort
        FilterItem.props.data[sortAttr] :
        // otherwise use the defaults
        FilterItem.props[sortAttr];
    });
    SortedItems = sortOrder === 'asc' ? SortedItems : SortedItems.reverse();

    return SortedItems;
  }

  searchFilterItems(FilterItems, searchTerm = this.props.searchTerm) {
    if (!searchTerm) return FilterItems; // exit case when no search is applied

    const SoughtItems =  FilterItems.filter(FilterItem => {
      const contents = FilterItem.getContentsLowercase();
      return ~contents.lastIndexOf(searchTerm);
    });

    return SoughtItems;
  }

  shuffleFilterItems(FilterItems) {
    let ShuffledItems = shuffle(FilterItems);
    // shuffle items until they are different from the initial FilteredItems
    while (FilterItems.length > 1 && filterItemArraysHaveSameSorting(FilterItems, ShuffledItems)) {
      ShuffledItems = shuffle(FilterItems);
    }

    return ShuffledItems;
  }  

  render(FilterItems) {
    const { multifilterLogicalOperator } = this.options;
    // get items to be filtered out
    const FilteredOutItems = this.props.FilterItems.filter(FilterItem => {
      const categories = FilterItem.getCategories();
      const filters = this.options.filter;
      const multiFilteringEnabled = Array.isArray(filters);
      if (multiFilteringEnabled) {
        if (multifilterLogicalOperator === 'or') {
          return !intersection(categories, filters).length;
        } else {
          return !allStringsOfArray1InArray2(filters, categories);
        }
      } else {
        return !stringInArray(categories, filters);
      }
    });
    // filter out old items
    FilteredOutItems.forEach(FilterItem => {
      FilterItem.filterOut(this.options.filterOutCss);
    });

    // Determine target positions for items to be filtered in
    const PositionsArray = Positions(this.options.layout, this);

    // filter in new items
    FilterItems.forEach((FilterItem, index) => {
      FilterItem.filterIn(PositionsArray[index], this.options.filterInCss);
    });
  }

  onTransitionEndCallback() {
    const { 
      filterizrState,
      FilterContainer,
    } = this.props;

    switch(filterizrState) {
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
    // cancel existing evts
    FilterContainer.unbindEvents();
    // rebind evts
    FilterContainer.bindEvents(callbacks);
    FilterContainer.bindTransitionEnd(() => { this.onTransitionEndCallback(); }, animationDuration);
  }

  bindEvents() {
    const { FilterContainer } = this.props;
    //- FilterContainer events
    this.rebindFilterContainerEvents();
    //- Generic Filterizr events
    // set up a window resize event to fire refiltering
    $(window).on('resize.Filterizr', debounce(() => {
      // update dimensions of items based on new window size
      FilterContainer.updateWidth();
      FilterContainer.updateFilterItemsDimensions();
      // refilter the grid to assume new positions
      this.filter(this.options.filter);
    }, 250));
  }
}

export default Filterizr;
