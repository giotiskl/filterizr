import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import Positions from './Positions';
import { 
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
  constructor(selector = ".filtr-container", options) {
    // make the options a property of the Filterizr instance
    // so that we can later easily modify them
    this.options = options;

    // setup FilterControls and FilterContainer
    const filterControls  = new FilterControls(this, options.controlsSelector);
    const filterContainer = new FilterContainer(selector, options);
    // define props
    this.props = {
      searchTerm: '',
      sort: 'index',
      sortOrder: 'asc',
      FilterContainer: filterContainer,
      FilterItems: filterContainer.props.FilterItems,
      FilteredItems: [],
    }

    // set up events needed by Filterizr
    this.bindEvents();
    // Init Filterizr
    this.filter(this.options.filter);
  }

  // Public API of Filterizr
  filter(category) {
    const { 
      searchTerm,
      FilterContainer,
      FilterItems,
    } = this.props;

    // trigger filtering start event
    FilterContainer.trigger('filteringStart');

    // cast category to string or array of strings
    category = Array.isArray(category) ?
      category.map(c => c.toString()) :
      category.toString();
    
    // filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(
      this.filterFilterItems(FilterItems, category), 
      searchTerm,
    );
    this.props.FilteredItems = FilteredItems;

    // set up events needed by Filterizr
    // render the items
    this.render(FilteredItems);

    // trigger filtering end event
    FilterContainer.trigger('filteringEnd');
  }

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

  sort(sortAttr = 'index', sortOrder = 'asc') {
    const { FilterItems } = this.props;

    // sort main array
    this.props.FilterItems = this.sortFilterItems(FilterItems, sortAttr, sortOrder);
    // apply filters
    const FilteredItems = this.filterFilterItems(this.props.FilterItems, this.options.filter);
    this.props.FilteredItems = FilteredItems;

    // Update and render the sorted items
    this.render(FilteredItems);
  }

  search(searchTerm = this.props.searchTerm) {
    const { FilterItems } = this.props;

    // filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(this.filterFilterItems(FilterItems, this.options.filter), searchTerm);
    this.props.FilteredItems = FilteredItems;

    // render the items
    this.render(FilteredItems);
  }

  shuffle() {
    const {
      FilteredItems
    } = this.props;

    const ShuffledItems = this.shuffleFilterItems(FilteredItems);
    this.props.FilteredItems = ShuffledItems;

    this.render(ShuffledItems);
  }

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
      ['progressive', 'alternate'],
    );
    checkOptionForErrors('filter', newOptions.filter, 'string|number');
    checkOptionForErrors('filterOutCss', newOptions.filterOutCss, 'object');
    checkOptionForErrors('filterInCss', newOptions.filterOutCss, 'object');
    checkOptionForErrors(
      'layout', 
      newOptions.layout, 
      'string',
      ['sameSize', 'vertical', 'horizontal', 'sameHeight', 'sameWidth', 'packed'],
    );
    checkOptionForErrors(
      'multifilterLogicalOperator', 
      newOptions.multifilterLogicalOperator, 
      'string',
      ['and', 'or'],
    );
    checkOptionForErrors('setupControls', newOptions.setupControls, 'boolean');

    // merge options
    this.options = merge(newOptions, this.options);

    // if callbacks defined then reregister events
    if ('callbacks' in newOptions)
      this.resetFilterContainerEvents();
  }

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
          activeFilters = "all";
        else
          // otherwise form an array with the two values
          activeFilters = [activeFilters, toggledFilter]
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
    const FilteredItems = (filters === "all") ?
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
    let ShuffledItems = shuffle(FilterItems)
    // shuffle items until they are different from the initial FilteredItems
    while (FilterItems.length > 1 && filterItemArraysHaveSameSorting(FilterItems, ShuffledItems)) {
      ShuffledItems = shuffle(FilterItems)
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

  resetFilterContainerEvents() {
    const { FilterContainer } = this.props;
    const { callbacks } = this.options;
    // cancel existing evts
    FilterContainer.unbindEvents();
    // rebind evts
    FilterContainer.bindEvents(callbacks);
  }

  bindEvents() {
    //- FilterContainer events
    this.resetFilterContainerEvents();
    //- Generic Filterizr events
    // set up a window resize event to fire refiltering
    $(window).on('resize.Filterizr', debounce((evt) => {
      // update dimensions of items based on new window size
      this.props.FilterContainer.updateWidth();
      this.props.FilterContainer.updateFilterItemsDimensions();
      // refilter the grid to assume new positions
      this.filter(this.options.filter);
    }, 250));
  }
}

export default Filterizr;
