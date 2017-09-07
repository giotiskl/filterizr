import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import Positions from './Positions';
import {
  debounce,
  isEqual,
  shuffle,
  sortBy,
} from './vendor/lodash.custom';
import { 
  intersection,
  merge,
  stringInArray 
} from './utils';

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
      FilterContainer: filterContainer,
      FilterItems: filterContainer.props.FilterItems,
      FilteredItems: [],
    }

    // set up events needed by Filterizr
    this.setupEvents();
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
      this.filterFilterItems(FilterItems, category), searchTerm
    );
    this.props.FilteredItems = FilteredItems;

    // set up events needed by Filterizr
    // render the items
    this.render(FilteredItems);

    // trigger filtering end event
    FilterContainer.trigger('filteringEnd');
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
    // merge options
    this.options = merge(newOptions, this.options);
    // if callbacks defined then reregister events
    if ('callbacks' in newOptions)
      this.setupFilterizrEvents();
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
    // Get filtered items
    const FilteredItems = (filters === "all") ?
      // in this case return all items
      FilterItems :
      // otherwise return filtered array
      FilterItems.filter(FilterItem => {
        const categories = FilterItem.getCategories();
        return Array.isArray(filters) ? 
          intersection(categories, filters).length :
          stringInArray(categories, filters)
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
    while (FilterItems.length > 1 && isEqual(FilterItems, ShuffledItems)) {
      ShuffledItems = shuffle(FilterItems)
    }

    return ShuffledItems;
  }  

  render(FilterItems) {
    // get items to be filtered out
    const FilteredOutItems = this.props.FilterItems.filter(FilterItem => {
      const categories = FilterItem.getCategories();
      const filters = this.options.filter;
      return Array.isArray(filters) ? 
        !intersection(categories, filters).length :
        !stringInArray(categories, filters)
    })
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

  setupFilterizrEvents() {
    const { FilterContainer } = this.props;
    const { callbacks } = this.options;

    // cancel existing evts
    FilterContainer.off('filteringStart filteringEnd shufflingStart shufflingEnd sortingStart sortingEnd')
    // rebind evts
    FilterContainer.on('filteringStart', callbacks.onFilteringStart);
    FilterContainer.on('filteringEnd', callbacks.onFilteringEnd);
    FilterContainer.on('shufflingStart', callbacks.onShufflingStart);
    FilterContainer.on('shufflingEnd', callbacks.onShufflingEnd);
    FilterContainer.on('sortingStart', callbacks.onSortingStart);
    FilterContainer.on('sortingEnd', callbacks.onSortingEnd);
  }

  setupEvents() {
    //- Filterizr events
    this.setupFilterizrEvents();
    //- Generic events
    // set up a window resize event to fire refiltering
    $(window).on('resize', debounce((evt) => {
      // update dimensions of items based on new window size
      this.props.FilterContainer.updateWidth();
      this.props.FilterContainer.updateFilterItemsDimensions();
      // refilter the grid to assume new positions
      this.filter(this.options.filter);
    }, 250));
  }
}

export default Filterizr;
