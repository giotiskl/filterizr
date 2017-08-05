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
      FilterContainer,
      FilterItems,
    } = this.props;

    // trigger filtering start event
    FilterContainer.trigger('filteringStart');
    // Get filtered items
    const FilteredItems = (category === "all") ?
      // in this case return all items
      FilterItems :
      // otherwise return filtered array
      _.filter(FilterItems, (FilterItem) => {
        const categories = FilterItem.getCategories();
        return _.includes(categories, category)
      });
    // update FilteredItems prop
    this.props.FilteredItems = FilteredItems;
    // render them on screen
    this.render(FilteredItems);
  }

  sort(sortAttr = 'index', sortOrder = 'asc') {
    const { 
      FilterItems,
    } = this.props;

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

    // Update and render the sorted items
    this.props.FilterItems = SortedItems;
    this.filter(this.options.filter);
  }

  shuffle() {
    const {
      FilteredItems
    } = this.props;

    // shuffle items until they are different from the initial FilteredItems
    let ShuffledItems = _.shuffle(FilteredItems)
    while (FilteredItems.length > 1 && _.isEqual(FilteredItems, ShuffledItems)) {
      ShuffledItems = _.shuffle(FilteredItems)
    }

    // update and render shuffled items
    this.props.FilteredItems = ShuffledItems;
    this.render(ShuffledItems);
  }

  setOptions(newOptions) {
    this.options = _.merge(this.options, newOptions);
  }

  // Helper methods
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
