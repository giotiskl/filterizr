import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import Positions from './Positions';
import _ from 'lodash';

class Filterizr {
  constructor(selector = ".filtr-container", options) {
    // make the options a property of the Filterizr instance
    // so that we can later easily modify them
    this.options = options;

    // setup FilterControls and FilterContainer
    const filterControls  = new FilterControls(this);
    const filterContainer = new FilterContainer(selector);
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
    this.options = _.merge(this.options, newOptions);
  }

  // Helper methods
  filterFilterItems(FilterItems, category) {
    // Get filtered items
    const FilteredItems = (category === "all") ?
      // in this case return all items
      FilterItems :
      // otherwise return filtered array
      _.filter(FilterItems, (FilterItem) => {
        const categories = FilterItem.getCategories();
        return _.includes(categories, category)
      });

    return FilteredItems;
  }

  sortFilterItems(FilterItems ,sortAttr = 'index', sortOrder = 'asc') {
    // Sort the FilterItems and reverse the array if order is descending
    let SortedItems = _.sortBy(FilterItems, (FilterItem) => {
      return (sortAttr !== 'index' && sortAttr !== 'sortData') ?
        // if the user has not used one of the two default sort attributes
        // then search for custom data attributes on the filter items to sort
        FilterItem.props.data[sortAttr] :
        // otherwise use the defaults
        FilterItem.props[sortAttr];
    });
    SortedItems = sortOrder === 'asc' ? SortedItems : _.reverse(SortedItems);

    return SortedItems;
  }

  searchFilterItems(FilterItems, searchTerm = this.props.searchTerm) {
    if (!searchTerm) return FilterItems; // exit case when no search is applied

    const SoughtItems =  _.filter(FilterItems, (FilterItem) => {
      const contents = FilterItem.getContentsLowercase();
      return _.includes(contents, searchTerm);
    });

    return SoughtItems;
  }

  shuffleFilterItems(FilterItems) {
    let ShuffledItems = _.shuffle(FilterItems)
    // shuffle items until they are different from the initial FilteredItems
    while (FilterItems.length > 1 && _.isEqual(FilterItems, ShuffledItems)) {
      ShuffledItems = _.shuffle(FilterItems)
    }

    return ShuffledItems;
  }  

  render(FilterItems) {
    // get items to be filtered out
    const FilteredOutItems = _.reject(this.props.FilterItems, (FilterItem) => {
      const  categories = FilterItem.getCategories();
      return _.includes(categories, this.options.filter);
    })
    // filter out old items
    _.each(FilteredOutItems, (FilterItem) => {
      FilterItem.filterOut();
    });

    // Determine target positions for items to be filtered in
    const PositionsArray = Positions(this.options.layout, this);

    // filter in new items
    _.each(FilterItems, (FilterItem, index) => {
      FilterItem.filterIn(PositionsArray[index]);
    });
  }
}

export default Filterizr;
