import FilterContainer from './FilterContainer';
import _ from 'lodash';

class Filterizr {
  constructor(selector = ".filtr-container", options) {
    // get and setup container
    this.FilterContainer = new FilterContainer(selector, options);
    // get and setup items
    this.FilterItems = this.FilterContainer.getFilterItems();
    // filter items with initial filter
    this.FilteredItems = this.filter(options.filter);

    this.render(this.FilteredItems);
    console.log(this.FilterContainer, this.FilterItems, this.FilteredItems);
  }

  // Public API of Filterizr
  filter(category) {
    // trigger filtering start event
    this.FilterContainer.trigger('filteringStart');
    // if category is set to all then no filter is applied
    return category === "all" ?
      // in this case return all items
      this.FilterItems :
      // otherwise return filtered array
      _.filter(this.FilterItems, (FilterItem) => {
        const categories = FilterItem.$node.attr('data-category').split(/\s*,\s*/g);
        return _.includes(categories, category)
      });
  }

  // Helper methods
  render(FilterItems) {
    _.each(FilterItems, (FilterItem) => {
      FilterItem.filterIn({
        left: '100',
        top: '100',
      })
    });
  }
}

export default Filterizr;
