import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import Positions from './Positions';
import {
  concat,
  each,
  filter,
  intersection,
  includes,
  isEqual,
  merge,
  reject,
  reverse,
  shuffle,
  sortBy,
} from 'lodash';

class Filterizr {
  constructor(selector = ".filtr-container", options) {
    // make the options a property of the Filterizr instance
    // so that we can later easily modify them
    this.options = options;

    // setup FilterControls and FilterContainer
    const filterControls  = new FilterControls(this);
    const filterContainer = new FilterContainer(selector, options);
    // define props
    this.props = {
      searchTerm: '',
      sort: 'index',
      sortOrder: 'asc',
      FilterControls: filterControls,
      FilterContainer: filterContainer,
      FilterItems: filterContainer.props.FilterItems,
      FilteredItems: [],
    }

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
    
    // filter items and optionally apply search if a search term exists
    const FilteredItems = this.searchFilterItems(this.filterFilterItems(FilterItems, category), searchTerm);
    this.props.FilteredItems = FilteredItems;

    // render the items
    this.render(FilteredItems);
  }

  sort(sortAttr = 'index', sortOrder = 'asc') {
    const { 
      FilterItems,
    } = this.props;

    // sort main array
    this.props.FilterItems = this.sortFilterItems(FilterItems, sortAttr, sortOrder);
    // apply filters
    const FilteredItems = this.filterFilterItems(this.props.FilterItems, this.options.filter);
    this.props.FilteredItems = FilteredItems;

    // Update and render the sorted items
    this.render(FilteredItems);
  }

  search(searchTerm = this.props.searchTerm) {
    const {
      FilterItems
    } = this.props;

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
    this.options = merge(this.options, newOptions);
  }

  toggleFilter(toggledFilter) {
    let activeFilters = this.options.filter;

    // if the active filters are already an array
    if (Array.isArray(activeFilters)) {
      // check if toggledFilter is there
      if (~activeFilters.indexOf(toggledFilter)) {
        // remove filter
        activeFilters = reject(activeFilters, f => f === toggledFilter);          
        // if there is now only 1 item in the array flatten it
        if (activeFilters.length === 1)
          activeFilters = activeFilters[0];
      }
      // otherwise just push it
      else
        activeFilters.push(toggledFilter);
    }
    // in case there is only one active filter, then form an array
    else  {
      // if the current filter is set to "all"
      activeFilters === "all" ?
        // then just set the filter to the int of the target filter
        activeFilters = toggledFilter :
        // if the active filter is already set to a category
        // and the user clicks another category filter, check
        // that they are not the same and
        (activeFilters !== toggledFilter) ?
        // form an array with both of them
        activeFilters = concat(activeFilters, toggledFilter) :
        // if the same category is clicked then revert filter to "all"
        activeFilters = "all";
    }

    // update active filter in Filterizr's options
    this.setOptions({
      filter: activeFilters,
    });

    this.filter(this.options.filter);
  }

  // Helper methods
  filterFilterItems(FilterItems, filters) {
    // Get filtered items
    const FilteredItems = (filters === "all") ?
      // in this case return all items
      FilterItems :
      // otherwise return filtered array
      filter(FilterItems, (FilterItem) => {
        const categories = FilterItem.getCategories();
        return Array.isArray(filters) ? 
          intersection(categories, filters).length :
          includes(categories, filters)
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
    SortedItems = sortOrder === 'asc' ? SortedItems : reverse(SortedItems);

    return SortedItems;
  }

  searchFilterItems(FilterItems, searchTerm = this.props.searchTerm) {
    if (!searchTerm) return FilterItems; // exit case when no search is applied

    const SoughtItems =  filter(FilterItems, (FilterItem) => {
      const contents = FilterItem.getContentsLowercase();
      return includes(contents, searchTerm);
    });

    return SoughtItems;
  }

  shuffleFilterItems(FilterItems) {
    let ShuffledItems = shuffle(FilterItems)
    // shuffle items until they are different from the initial FilteredItems
    while (FilterItems.length > 1 && isEqual(FilterItems, ShuffledItems)) {
      ShuffledItems = shuffle(FilterItems)
    }

    return ShuffledItems;
  }  

  render(FilterItems) {
    // get items to be filtered out
    const FilteredOutItems = reject(this.props.FilterItems, (FilterItem) => {
      const categories = FilterItem.getCategories();
      const filters = this.options.filter;
      return Array.isArray(filters) ? 
        intersection(categories, filters).length :
        includes(categories, filters)
    })
    // filter out old items
    each(FilteredOutItems, (FilterItem) => {
      FilterItem.filterOut(this.options);
    });

    // Determine target positions for items to be filtered in
    const PositionsArray = Positions(this.options.layout, this);

    // filter in new items
    each(FilterItems, (FilterItem, index) => {
      FilterItem.filterIn(PositionsArray[index], this.options);
    });
  }
}

export default Filterizr;
